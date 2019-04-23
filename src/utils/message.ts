import { window } from 'vscode';

export enum MessageType {
  INFO = 'info',
  ERROR = 'error',
  WARNING = 'warning'
}

export function showMessage(type: MessageType, message: string) {
  switch (type) {
    case MessageType.INFO:
      window.showInformationMessage(message);
      break;

    case MessageType.WARNING:
      window.showWarningMessage(message);
      break;

    case MessageType.ERROR:
      window.showErrorMessage(message);
      break;

    default:
      break;
  }
}
