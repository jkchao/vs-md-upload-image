import * as qiniu from 'qiniu';
import { workspace, window, ProgressLocation, StatusBarAlignment } from 'vscode';
import { QINIU_PREFIX, QINIU_DOMAIN } from './constants';
import * as path from 'path';
import { getToken } from './utils/token';
import { showMessage, MessageType } from './utils/message';

interface Response {
  fileUrl: string;
  fileName: string;
}

export async function uploadFileToQN(filePath: string) {
  const domain = workspace.getConfiguration('qiniu').get<string>(QINIU_DOMAIN);
  const prefix = workspace.getConfiguration('qiniu').get<string>(QINIU_PREFIX);

  const token = getToken();

  const config = new qiniu.conf.Config();
  const formUploader = new qiniu.form_up.FormUploader(config);
  const fileName = path.basename(filePath);
  const key = !!prefix ? `${prefix}/${fileName}` : `${fileName}`;
  const extra = new qiniu.form_up.PutExtra();

  return new Promise<Response>((resolve, reject) => {
    formUploader.putFile(token, key, filePath, extra, (err, body, info) => {
      if (err) {
        showMessage(MessageType.ERROR, err.message);
        reject(err);
      }
      if (info.statusCode === 200) {
        showMessage(MessageType.INFO, 'upload success');

        resolve({
          fileUrl: domain!.endsWith('/') ? `${domain}${fileName}` : `${domain}/${fileName}`,
          fileName
        });
      } else {
        showMessage(MessageType.ERROR, body.error);
        reject(body);
      }
    });
  });
}
