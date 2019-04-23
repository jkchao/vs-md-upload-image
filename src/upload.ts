import * as qiniu from 'qiniu';
import { workspace } from 'vscode';
import { QINIU_BUCKET, QINIU_AK, QINIU_SK, QINIU_PREFIX, QINIU_DOMAIN } from './constants';
import * as path from 'path';
import { getToken } from './utils/token';

interface Response {
  fileUrl: string;
  fileName: string;
}

export async function uploadFileToQN(filePath: string): Promise<Response> {
  const domain = workspace.getConfiguration('qiniu').get<string>(QINIU_DOMAIN);
  const prefix = workspace.getConfiguration('qiniu').get<string>(QINIU_PREFIX);

  const token = getToken();

  const config = new qiniu.conf.Config();
  const formUploader = new qiniu.form_up.FormUploader(config);
  const fileName = path.basename(filePath);
  const key = !!prefix ? `${prefix}/${fileName}` : `${fileName}`;
  const extra = new qiniu.form_up.PutExtra();

  return new Promise((resolve, reject) => {
    formUploader.putFile(token, key, filePath, extra, (err, body, info) => {
      if (err) {
        reject(err);
      }
      if (info.statusCode === 200) {
        resolve({
          fileUrl: `${domain}${body.key}`,
          fileName
        });
      } else {
        reject(body);
      }
    });
  });
}
