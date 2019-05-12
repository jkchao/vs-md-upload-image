import { hasConfig, checkCurrentFile } from './utils';
import { window, ViewColumn, Uri, ExtensionContext } from 'vscode';
import { WebViewContent } from './webviewContent';
import { writeFileSync, readFileSync, mkdirSync, existsSync, unlinkSync } from 'fs';
import { join, basename } from 'path';
import * as gm from 'gm';
import { Upload } from './upload';
import { showMessage, MessageType } from './utils/message';

export function selectFileToUpload(context: ExtensionContext) {
  if (!hasConfig() || !checkCurrentFile()) {
    return false;
  }

  const rootPath = context.extensionPath;

  const activeTextEditor = window.activeTextEditor;

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

      const outPut = `${imagePath}/${basename(filePath)}`;

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

      paner.onDidChangeViewState(
        e => {
          const paner = e.webviewPanel;
          switch (paner.visible) {
            case false:
              showMessage(MessageType.INFO, '检测到上传文件 tab 不可见，请重新上传');
              paner.dispose();
              break;
          }
        },
        null,
        context.subscriptions
      );

      paner.webview.onDidReceiveMessage(message => {
        switch (message.command) {
          case 'complete':
            const { width, height, left, top } = message.data;
            gm(outPut)
              .crop(width, height, left, top)
              .write(outPut, async err => {
                if (!err) {
                  // 成功后关闭 paner
                  // TODO: 能否在上传成功之后在关闭 paner？试过，行不通，找其他办法。
                  paner.dispose();

                  const upload = new Upload();
                  const result = await upload.insertToMD(outPut);
                  if (result) {
                    await unlinkSync(outPut);
                    console.info('delete:' + outPut + '**** success');
                  }
                }
              });
            return;
        }
      });

      paner.webview.html = new WebViewContent(rootPath).createWebViewContent();
    });
}
