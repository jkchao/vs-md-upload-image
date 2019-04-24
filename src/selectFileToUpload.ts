import { hasConfig, checkCurrentFile } from './utils';
import { window, ViewColumn, Uri } from 'vscode';
import { insertToMd } from './insert';
import { createWebviewContent } from './webviewContent';
import { writeFileSync, readFileSync, createReadStream, createWriteStream, fstat, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

export function selectFileToUpload() {
  if (!hasConfig() || !checkCurrentFile()) {
    return false;
  }

  window
    .showOpenDialog({
      filters: { Images: ['png', 'jpg', 'jpeg', 'gif'] }
    })
    .then(file => {
      if (!file) return;
      const { path: filePath } = file[0];

      const path = join(__dirname, '..', `/images/`);

      if (!existsSync(path)) {
        mkdirSync(path);
      }

      const outPut = `${path}${basename(filePath)}`;

      writeFileSync(`${outPut}`, readFileSync(filePath));

      const paner = window.createWebviewPanel('image Corp', 'Image Corp', ViewColumn.One);

      paner.webview.html = createWebviewContent(outPut);
      // return insertToMd(path);
    });
}
