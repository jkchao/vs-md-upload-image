import { uploadFileToQN } from './upload';
import { window } from 'vscode';

export async function insertToMd(path: string) {
  try {
    const file = await uploadFileToQN(path);

    const editor = window.activeTextEditor;
    const img = `![${file.fileName}](${file.fileUrl})`;

    editor!.edit(text => {
      text.insert(editor!.selection.active, img);
    });
  } catch (error) {
    window.showErrorMessage(error);
  }
}
