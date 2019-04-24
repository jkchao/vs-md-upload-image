import { hasConfig, checkCurrentFile } from './utils';
import { window, ViewColumn } from 'vscode';
import { insertToMd } from './insert';
import { createWebviewContent } from './webviewContent';

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
      const { path } = file[0];

      const paner = window.createWebviewPanel('image Corp', 'Image Corp', ViewColumn.One);

      paner.webview.html = createWebviewContent(path);
      // return insertToMd(path);
    });
}
