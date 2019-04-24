import * as vscode from 'vscode';

export function createWebviewContent(path: string) {
  console.log(path);
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Image Crop</title>
  </head>
  <body>
      <img src="${path}" width="300"  />
  </body>
  </html>`;
}
