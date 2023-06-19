import { Request, Response, NextFunction } from 'express';
import { MovieDetailDeleteSuccess } from 'src/interface/swagger-model/movieDetailDeleteSuccess';

class ChatGPTController {
    constructor() {

    }

    // ———————————————————————  取得chatGPT的金鑰  ———————————————————————
    getChatGPTKey = async (req: Request<{}, MovieDetailDeleteSuccess, {}, {}, {}>, res: Response, next: NextFunction) => {
        let key: string = process.env.CHATGPT_TOKEN;

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


}



export default new ChatGPTController();