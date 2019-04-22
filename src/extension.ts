import * as vscode from 'vscode';
import { hasConfig, checkCurrentFile } from './utils';
import { uploadFile } from './upload';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vs-md-upload-image" is now active!');

  const selectFile = vscode.commands.registerCommand(
    'extension.select.file',

    async () => {
      if (!hasConfig() || !checkCurrentFile()) {
        return false;
      }

      try {
        const file = await vscode.window.showOpenDialog({
          filters: { Images: ['png', 'jpg', 'jpeg', 'gif'] }
        });

        if (!file) return;

        const { path } = file[0];

        uploadFile(path);
      } catch (error) {
        vscode.window.showErrorMessage(error);
      }
    }
  );

  context.subscriptions.push(selectFile);
}

// this method is called when your extension is deactivated
export function deactivate() {
  // ..
}
