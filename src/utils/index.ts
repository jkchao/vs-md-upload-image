import { window, workspace } from 'vscode';

export function hasConfig() {
  const config = workspace.getConfiguration('qiniu');

  if (!config.get('ak') || !config.get('sk')) {
    window.showErrorMessage('qiniu ak and sk not find in your settings');
    return false;
  }

  return true;
}

export function checkCurrentFile() {
  // current file
  const currentFile = window.activeTextEditor;

  if (!currentFile || currentFile.document.languageId !== 'markdown') {
    window.showErrorMessage('place open a .md file if you wath upload a file');
    return false;
  }

  return true;
}
