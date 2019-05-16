import * as vscode from 'vscode';

class UploadStatusBar implements vscode.Disposable {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    this.statusBarItem.text = 'Upload';
    this.statusBarItem.command = 'QN.select.file';
    this.statusBarItem.show();
  }

  public dispose() {
    // ..
  }
}

export const uploadStatusBar = new UploadStatusBar();
