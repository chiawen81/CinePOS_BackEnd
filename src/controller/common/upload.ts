import { NextFunction } from 'express';
import firebaseAdmin from '../../service/firebase-admin';
import multer from 'multer';
import User from "../../models/common/usersModels";

const uuid = require('uuid');

class UploadController {

    constructor() {

    }



    // ———————————————————————  更新大頭貼照片  ———————————————————————
    uploadSticker(req, res, next: NextFunction) {
        console.log('req.file', req.file);
        const bucket = firebaseAdmin.storage().bucket();
        const file = req.file;                                              // 取得上傳的檔案資訊
        const uniqueId = uuid.v4();                                         // 產生唯一識別碼
        const fileName = uniqueId + '-' + file.originalname;
        const blob = bucket.file(fileName);                                 // 基於檔案的原始名稱建立一個 blob 物件
        const blobStream = blob.createWriteStream();                        // 建立一個可以寫入 blob 的物件


        // 監聽上傳完成事件
        blobStream.on('finish', async () => {
            console.log('上傳成功');

            // 設定檔案的存取權限
            const config = {
                action: 'read',         // 權限
                expires: '12-31-2030',  // 網址的有效期限
            };

            // 取得檔案的網址
            blob.getSignedUrl(config, async (err, imgUrl) => {
                console.log('檔案網址', imgUrl);
                // 整理相關資料
                req.fileData = {
                    fileName,
                    err,
                    imgUrl,
                    file
                };
                console.log('我接到囉～');
                console.log('req.fileData', req.fileData);
                console.log('req.user', req.user);

                let updateData = {
                    stickerUrl: req.fileData.imgUrl,
                    stickerFileName: req.fileData.fileName
                };
                let condition = { staffId: req.user.staffId };

                const updatedUser = await User.findOneAndUpdate(
                    condition,          // 條件
                    updateData,         // 更新的內容
                    { new: true }       // 參數(表示返回更新後的文檔。如果沒有設置這個參數，則返回更新前的文檔。)
                );
                console.log('updatedUser ', updatedUser);

                res.send({
                    code: 1,
                    message: '上傳成功！',
                    data: {
                        stickerFileName: updateData.stickerFileName,
                        stickerUrl: updateData.stickerUrl
                    }
                });
            });
        });


        // 上傳失敗
        blobStream.on('error', (err) => {
            res.status(500).send(`上傳失敗：${err.message}`);
        });


        // 將檔案的 buffer 寫入 blobStream
        blobStream.end(file.buffer, () => {
            console.log('結束～～～')
        });
    }





    // ———————————————————————  刪除檔案  ———————————————————————
    deleteFile(fileName: string) {
        const bucket = firebaseAdmin.storage().bucket();
        const blob = bucket.file(fileName);                // 取得檔案
        // 刪除檔案
        blob.delete().then(() => {
            console.log('刪除成功');
        }).catch((err) => {
            console.log('刪除失敗');
        });
    }





    // ———————————————————————  驗證  ———————————————————————
    // 照片
    photoValidator = multer({
        limits: {
            fileSize: 5 * 1024 * 1024,  // 5MB
        },
    }).single('photo');

    // 檔案
    uploadFileValidator = multer({
        limits: {
            fileSize: 5 * 1024 * 1024,  // 5MB
        },
    }).single('file');
}



export default new UploadController();
