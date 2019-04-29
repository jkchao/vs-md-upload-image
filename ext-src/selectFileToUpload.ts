import { hasConfig, checkCurrentFile } from './utils';
import { window, ViewColumn, Uri } from 'vscode';
import { insertToMd } from './insert';
import { WebViewContent } from './webviewContent';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

export function selectFileToUpload(rootPath: string) {
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

      const imagePath = join(rootPath, `/images/`);

      if (!existsSync(imagePath)) {
        mkdirSync(imagePath);
      }

      const outPut = `${rootPath}${basename(filePath)}`;

      writeFileSync(`${outPut}`, readFileSync(filePath));

      const paner = window.createWebviewPanel('image Corp', 'Image Corp', ViewColumn.One, {
        enableScripts: true
      });

      paner.webview.html = new WebViewContent(outPut, rootPath).createWebViewContent();
      // return insertToMd(path);
    });
}
