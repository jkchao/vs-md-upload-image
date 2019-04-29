import * as vscode from 'vscode';
import { join } from 'path';

export class WebViewContent {
  private buildPath: string;
  constructor(private imagePath: string, rootPath: string) {
    this.buildPath = join(rootPath, 'build');
  }

  private readFileOnDisk(path: string) {
    return vscode.Uri.file(join(this.buildPath, path)).with({
      scheme: 'vscode-resource'
    });
  }

  public createWebViewContent() {
    // script
    const manifest = require(`${this.buildPath}/asset-manifest.json`);
    const mainScript = manifest.files['main.js'];
    const mainStyle = manifest.files['main.css'];
    const runtimeScript = manifest.files['runtime~main.js'];
    // chunk
    const chunkScript = [];
    for (const key in manifest.files) {
      if (key.endsWith('.chunk.js') && manifest.files.hasOwnProperty(key)) {
        // finding their paths on the disk
        const chunk = this.readFileOnDisk(manifest.files[key]);
        chunkScript.push(chunk);
      }
    }

    const runtimeScriptOnDisk = this.readFileOnDisk(runtimeScript);
    const mainScriptOnDisk = this.readFileOnDisk(mainScript);
    const styleScriptOnDisk = this.readFileOnDisk(mainStyle);

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Image Crop</title>
        <link rel="stylesheet" type="text/css" href="${styleScriptOnDisk}">
    </head>
    <body>
      <div id="root"></div>
      <script src="${runtimeScriptOnDisk}"></script>
      ${chunkScript.map((item: vscode.Uri) => `<script src="${item}"></script>`)}
      <script src="${mainScriptOnDisk}"></script>
    </body>
    </html>`;
  }
}
