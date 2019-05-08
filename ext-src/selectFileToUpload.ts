import { hasConfig, checkCurrentFile } from './utils';
import { window, ViewColumn, Uri, ExtensionContext } from 'vscode';
import { insertToMd } from './insert';
import { WebViewContent } from './webviewContent';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { crop } from './crop';

export function selectFileToUpload(context: ExtensionContext) {
  if (!hasConfig() || !checkCurrentFile()) {
    return false;
  }

  // const currentFileUri = window.activeTextEditor.document.uri;

  const rootPath = context.extensionPath;

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

      const outPut = `${rootPath}/${basename(filePath)}`;

      // 写文件到项目，如果不在此项目下，无权利访问
      writeFileSync(`${outPut}`, readFileSync(filePath));

      const paner = window.createWebviewPanel('image Corp', 'Image Corp', ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true
      });

      paner.webview.postMessage({
        command: 'image',
        // TODO: use Uri.file(outPut).width({ scheme: 'vscode-resource'})
        data: `vscode-resource:${outPut}`
      });

      paner.webview.onDidReceiveMessage(message => {
        console.log(message);
        switch (message.command) {
          case 'complete':
            crop({
              src: outPut,
              ...message.data
            });
            return;
        }
      });

      paner.webview.html = new WebViewContent(outPut, rootPath).createWebViewContent();
      // return insertToMd(path);
    });
}
