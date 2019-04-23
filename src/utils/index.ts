import { window, workspace } from 'vscode';
import { QINIU_AK, QINIU_SK, QINIU_BUCKET, QINIU_DOMAIN } from '../constants';
import { showMessage, MessageType } from './message';

export function hasConfig() {
  const config = workspace.getConfiguration('qiniu');

  if (!config.get(QINIU_AK) || !config.get(QINIU_SK) || !config.get(QINIU_BUCKET) || !config.get(QINIU_DOMAIN)) {
    showMessage(MessageType.ERROR, 'qiniu ak、sk、bucket、domain not find in your settings');
    return false;
  }

  return true;
}

export function checkCurrentFile() {
  // current file
  const currentFile = window.activeTextEditor;

  if (!currentFile || currentFile.document.languageId !== 'markdown') {
    showMessage(MessageType.ERROR, 'place open a .md file if you wath upload a file');
    return false;
  }

  return true;
}
