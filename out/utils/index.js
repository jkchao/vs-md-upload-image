"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function hasConfig() {
    const config = vscode_1.workspace.getConfiguration('qiniu');
    if (!config.get('ak') || !config.get('sk')) {
        vscode_1.window.showErrorMessage('qiniu ak and sk not find in your settings');
        return false;
    }
    return true;
}
exports.hasConfig = hasConfig;
function checkCurrentFile() {
    // current file
    const currentFile = vscode_1.window.activeTextEditor;
    if (!currentFile || currentFile.document.languageId !== 'markdown') {
        vscode_1.window.showErrorMessage('place open a .md file if you wath upload a file');
        return false;
    }
    return true;
}
exports.checkCurrentFile = checkCurrentFile;
//# sourceMappingURL=index.js.map