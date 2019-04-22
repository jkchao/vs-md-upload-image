"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const utils_1 = require("./utils");
const upload_1 = require("./upload");
function activate(context) {
    console.log('Congratulations, your extension "vs-md-upload-image" is now active!');
    const selectFile = vscode.commands.registerCommand('extension.select.file', () => __awaiter(this, void 0, void 0, function* () {
        if (!utils_1.hasConfig() || !utils_1.checkCurrentFile()) {
            return false;
        }
        try {
            const file = yield vscode.window.showOpenDialog({
                filters: { Images: ['png', 'jpg', 'jpeg', 'gif'] }
            });
            if (!file)
                return;
            const { path } = file[0];
            upload_1.uploadFile(path);
        }
        catch (error) {
            vscode.window.showErrorMessage(error);
        }
    }));
    context.subscriptions.push(selectFile);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    // ..
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map