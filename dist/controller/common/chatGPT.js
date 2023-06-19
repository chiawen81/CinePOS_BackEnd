"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = require("crypto-js");
class ChatGPTController {
    constructor() {
        this.getChatGPTKey = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let key = process.env.CHATGPT_TOKEN;
            try {
                res.status(200).json({
                    code: 1,
                    message: "成功取得ChatGPT金鑰！",
                    data: key
                });
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: `取得ChatGPT金鑰失敗！錯誤訊息：${err.message}`,
                });
            }
            ;
        });
    }
    encryptData(data, key) {
        const encrypted = crypto_js_1.AES.encrypt(data, key).toString();
        return encrypted;
    }
    decryptData(encryptedData, key) {
        const decrypted = crypto_js_1.AES.decrypt(encryptedData, key).toString(crypto_js_1.enc.Utf8);
        return decrypted;
    }
}
exports.default = new ChatGPTController();
