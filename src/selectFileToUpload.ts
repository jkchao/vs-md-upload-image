import { hasConfig, checkCurrentFile } from './utils';
import { window } from 'vscode';
import { insertToMd } from './insert';

export function selectFileToUpload() {
  if (!hasConfig() || !checkCurrentFile()) {
    return false;
  }

  window
    .showOpenDialog({
      filters: { Images: ['png', 'jpg', 'jpeg', 'gif'] }
    })
    .then(file => {
      if (!file) return;
      const { path } = file[0];
      return insertToMd(path);
    });
}
