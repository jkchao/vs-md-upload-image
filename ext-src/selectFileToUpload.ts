import { hasConfig } from './utils';
import { window, ExtensionContext, workspace } from 'vscode';
import { writeFileSync, readFileSync, mkdirSync, existsSync, unlinkSync } from 'fs';
import { join, basename } from 'path';
import { QINNIU_NEEDCROP } from './constants';
import { WebView } from './webView';
import { Upload } from './upload';

export function selectFileToUpload(context: ExtensionContext) {
  if (!hasConfig()) {
    return false;
  }

  const rootPath = context.extensionPath;

  window
    .showOpenDialog({
      filters: { Images: ['png', 'jpg', 'jpeg', 'gif'] }
    })
    .then(async file => {
      if (!file) return;
      const { path: filePath } = file[0];

      const imagePath = join(rootPath, `/images/`);

      if (!existsSync(imagePath)) {
        mkdirSync(imagePath);
      }

      const outPut = `${imagePath}/${basename(filePath)}`;

      // 写文件到项目，如果不在此项目下，无权利访问
      writeFileSync(`${outPut}`, readFileSync(filePath));

      const config = workspace.getConfiguration('qiniu');
      const neeCrop = config.get(QINNIU_NEEDCROP);

      if (!neeCrop) {
        const qnUpload = new Upload();
        const result = await qnUpload.insertToMD(outPut);
        if (result) {
          await unlinkSync(outPut);
          console.info('delete:' + outPut + '**** success');
        }
        return result;
      } else {
        const webView = new WebView(outPut, context, rootPath);
        return webView.lauch();
      }
    });
}
