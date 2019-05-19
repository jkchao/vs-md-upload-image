import * as qiniu from 'qiniu';
import { workspace, window, Clipboard, ProgressLocation, StatusBarAlignment, WorkspaceConfiguration } from 'vscode';
import { QINIU_PREFIX, QINIU_DOMAIN, QINIU_AK, QINIU_SK, QINIU_BUCKET } from './constants';
import * as path from 'path';
import { showMessage, MessageType } from './utils/message';
import * as dateformat from 'dateformat';

import * as ncp from 'copy-paste';

interface Response {
  fileUrl: string;
  fileName: string;
}

export class Upload {
  private token: string;
  private config: WorkspaceConfiguration;
  constructor() {
    this.config = workspace.getConfiguration('qiniu');
    this.token = this.getToken();
  }

  private getToken() {
    const ac = this.config.get<string>(QINIU_AK);
    const sc = this.config.get<string>(QINIU_SK);

    const bucket = this.config.get<string>(QINIU_BUCKET);
    const mac = new qiniu.auth.digest.Mac(ac, sc);

    const putPolicy = new qiniu.rs.PutPolicy({
      scope: bucket
    });
    return putPolicy.uploadToken(mac);
  }

  private toQN(filePath: string) {
    // TODO: ProgressLocation

    const now = new Date();

    const domain = this.config.get<string>(QINIU_DOMAIN);
    const prefix = this.config.get<string>(QINIU_PREFIX) || dateformat(now, 'isoDate');

    const config = new qiniu.conf.Config();
    const formUploader = new qiniu.form_up.FormUploader(config);
    const fileName = path.basename(filePath);
    const key = `${prefix}/${fileName}`;
    const extra = new qiniu.form_up.PutExtra();

    return new Promise<Response>((resolve, reject) => {
      formUploader.putFile(this.token, key, filePath, extra, (err, body, info) => {
        if (err) {
          showMessage(MessageType.ERROR, err.message);
          reject(err);
        }
        if (info.statusCode === 200) {
          const fileUrl = domain!.endsWith('/') ? `${domain}${key}` : `${domain}/${key}`;

          resolve({
            fileUrl,
            fileName
          });
        } else {
          showMessage(MessageType.ERROR, `QiNiu Error: ${body.error}`);
          reject(body);
        }
      });
    });
  }

  public async insertToMD(path: string) {
    const { fileUrl, fileName } = await this.toQN(path);

    const img = `![${fileName}](${fileUrl})`;

    ncp.copy(fileUrl, () => {
      showMessage(MessageType.INFO, '上传成功，已将 url 复制至剪切板: ' + fileUrl);
    });

    const editor = window.activeTextEditor;

    if (editor && editor.document.languageId === 'markdown') {
      return editor!.edit(text => {
        text.insert(editor!.selection.active, img);
      });
    }
  }
}
