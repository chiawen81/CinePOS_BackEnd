import { Request, Response, NextFunction } from 'express';
import { MovieDetailDeleteSuccess } from '../../interface/swagger-model/movieDetailDeleteSuccess';
import { enc, AES } from 'crypto-js';

class ChatGPTController {
    constructor() {

    }

    // ———————————————————————  取得chatGPT的金鑰  ———————————————————————
    getChatGPTKey = async (req: Request<{}, MovieDetailDeleteSuccess, {}, {}, {}>, res: Response, next: NextFunction) => {
        let key = process.env.CHATGPT_TOKEN;
        // const encryptedData = this.encryptData(process.env.CHATGPT_TOKEN, process.env.CRYPTOKEY);
        // console.log('加密後的資料:', encryptedData);

        // const decryptedData = this.decryptData(encryptedData, process.env.CRYPTOKEY);
        // console.log('解密後的資料:', decryptedData);

        try {
            res.status(200).json({
                code: 1,
                message: "成功取得ChatGPT金鑰！",
                data: key
            });

        } catch (err) {
            res.status(500).json({
                code: -1,
                message: `取得ChatGPT金鑰失敗！錯誤訊息：${err.message}`,
            });
        };
    }


    // 加密函式
    encryptData(data: string, key: string): string {
        const encrypted = AES.encrypt(data, key).toString();
        return encrypted;
    }

    // 解密函式
    decryptData(encryptedData: string, key: string): string {
        const decrypted = AES.decrypt(encryptedData, key).toString(enc.Utf8);
        return decrypted;
    }


}



export default new ChatGPTController();