import { window, MessageOptions } from 'vscode';

export enum MessageType {
  INFO = 'info',
  ERROR = 'error',
  WARNING = 'warning'
}

export function showMessage(type: MessageType, message: string, options: MessageOptions = {}) {
  switch (type) {
    case MessageType.INFO:
      window.showInformationMessage(message, options);
      break;

    case MessageType.WARNING:
      window.showWarningMessage(message, options);
      break;

    case MessageType.ERROR:
      window.showErrorMessage(message, options);
      break;

    default:
      break;
  }
}
