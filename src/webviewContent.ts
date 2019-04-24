import * as vscode from 'vscode';
import { join } from 'path';

export function createWebviewContent(path: string) {
  const stylePath = vscode.Uri.file(join(__dirname, '..', 'corp.css')).with({ scheme: 'vscode-resource' });
  const imagePath = vscode.Uri.file(path).with({ scheme: 'vscode-resource' });

  console.log(stylePath);

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Image Crop</title>
      <link rel="stylesheet" href="${stylePath}">
  </head>
  <body>
    <div class="box">
      <img src="${imagePath}" class="origin-image"/>
    </div>
  </body>
  </html>`;
}
