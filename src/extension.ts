import * as vscode from 'vscode';
import { selectFileToUpload } from './selectFileToUpload';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vs-md-upload-image" is now active!');

  context.subscriptions.push(vscode.commands.registerCommand('QN.select.file', () => selectFileToUpload()));
}

// this method is called when your extension is deactivated
export function deactivate() {
  // ..
}
