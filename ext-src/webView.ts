import { WebviewPanel, window, ViewColumn, ExtensionContext } from 'vscode';
import { showMessage, MessageType } from './utils/message';
import * as gm from 'gm';
import { WebViewContent } from './webviewContent';
import { Upload } from './upload';
import { unlinkSync } from 'fs';

export class WebView {
  private paner: WebviewPanel | null = null;

  constructor(private outPut: string, private context: ExtensionContext, private rootPath: string) {}

  private postMessage() {
    this.paner.webview.postMessage({
      command: 'image',
      // TODO: use Uri.file(outPut).width({ scheme: 'vscode-resource'})
      data: `vscode-resource:${this.outPut}`
    });
  }

  private async upload() {
    const qnUpload = new Upload();
    const result = await qnUpload.insertToMD(this.outPut);
    if (result) {
      await unlinkSync(this.outPut);
      console.info('delete:' + this.outPut + '**** success');
    }
    return result;
  }

  public lauch() {
    this.paner = window.createWebviewPanel('image Corp', 'Image Corp', ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true
    });

    this.postMessage();

    this.paner.onDidChangeViewState(
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
      this.context.subscriptions
    );

    this.paner.webview.onDidReceiveMessage(message => {
      switch (message.command) {
        case 'complete':
          const { width, height, left, top } = message.data;
          gm(this.outPut)
            .crop(width, height, left, top)
            .write(this.outPut, async err => {
              if (!err) {
                // 成功后关闭 paner
                // TODO: 能否在上传成功之后在关闭 paner？试过，行不通，找其他办法。
                this.paner.dispose();

                return this.upload();
              }
            });
          return;
      }
    });

    this.paner.webview.html = new WebViewContent(this.rootPath).createWebViewContent();
  }
}
