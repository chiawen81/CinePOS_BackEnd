import { NextFunction } from 'express';
import firebaseAdmin from '../../service/firebase-admin';
import multer from 'multer';
import uuid from 'uuid';

class UploadController {
    bucket = firebaseAdmin.storage().bucket();
    upload = multer({
        limits: {
            fileSize: 5 * 1024 * 1024,  // 5MB
        },
    });

    constructor() {

    }

    uploadFile(req, res, next: NextFunction, onFinishFunc: Function) {
        console.log('bucket:', this.bucket);

        const file = req.file;                                              // 取得上傳的檔案資訊
        const uniqueId = uuid.v4();                                         // 產生唯一識別碼
        const fileName = uniqueId + '-' + file.originalname;
        const blob = this.bucket.file(fileName);                            // 基於檔案的原始名稱建立一個 blob 物件
        const blobStream = blob.createWriteStream();                        // 建立一個可以寫入 blob 的物件
        console.log(file);

        // 監聽上傳狀態，當上傳完成時，會觸發 finish 事件
        blobStream.on('finish', () => {
            res.send('上傳成功');

            // 設定檔案的存取權限
            const config = {
                action: 'read',         // 權限
                expires: '12-31-2030',  // 網址的有效期限
            };

            // 取得檔案的網址
            blob.getSignedUrl(config, async (err, imgUrl) => {
                onFinishFunc();     // 執行傳入的 onFinishFunc

                res.send({
                    message: '上傳成功！',
                    fileName: fileName,
                    imgUrl
                });
            });
        });


        // 如果上傳過程中發生錯誤，會觸發 error 事件
        blobStream.on('error', (err) => {
            console.error(err);
            res.status(500).send(`上傳失敗：${err.message}`);
        });


        // 將檔案的 buffer 寫入 blobStream
        blobStream.end(file.buffer);
    };
}

export default new UploadController();
