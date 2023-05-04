import { NextFunction } from 'express';
import firebaseAdmin from '../../service/firebase-admin';
import multer from 'multer';
import ErrorService from "./../../service/error";
const uuid = require('uuid');

class UploadController {

    constructor() {

    }



    // ———————————————————————  上傳檔案/照片  ———————————————————————
    upload = async (req, res, next: NextFunction) => {
        try {
            console.log('req.file', req.file);
            const bucket = firebaseAdmin.storage().bucket();
            const file = req.file;                                              // 取得上傳的檔案資訊
            const uniqueId = uuid.v4();                                         // 產生唯一識別碼
            const fileName = uniqueId + '-' + file.originalname;
            const blob = bucket.file(fileName);                                 // 基於檔案的原始名稱建立一個 blob 物件
            const blobStream = blob.createWriteStream();                        // 建立一個可以寫入 blob 的物件

            // 監聽上傳完成事件
            blobStream.on('finish', async () => {
                // 設定檔案的存取權限
                const config = {
                    action: 'read',                                             // 權限
                    expires: '12-31-2030',                                      // 網址的有效期限
                };

                // 取得檔案網址
                blob.getSignedUrl(config, async (err, imgUrl) => {
                    console.log('檔案網址', imgUrl);
                    req.fileData = { fileName, err, imgUrl, file };             // 整理相關資料
                    next();                                                     // 後續自訂義的處理
                });
            });


            // 上傳失敗
            blobStream.on('error', (err) => {
                res.status(500).send(`上傳失敗：${err.message}`);
            });

            // 上傳結束
            blobStream.end(file.buffer);                                        // 將檔案的 buffer 寫入 blobStream

        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "上傳檔案錯誤！"
            });
        };
    }





    // ———————————————————————  刪除檔案  ———————————————————————
    deleteFile = async function deleteFile(req, res, next, fileName: string) {
        try {
            console.log('刪除檔案');
            const bucket = firebaseAdmin.storage().bucket();
            const blob = bucket.file(fileName);                // 取得檔案

            // 刪除檔案
            blob.delete().then(() => {
                console.log('刪除成功');
            }).catch((err) => {
                console.log('刪除失敗');
            });

        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "刪除檔案錯誤！"
            });
        };

    }





    // ———————————————————————  驗證  ———————————————————————
    // 照片驗證
    photoValidator = (req: Request, res: Response, next: NextFunction) => {
        return multer({
            limits: { fileSize: 1 * 1024 * 1024 },                              // 限制上傳檔案的大小為 1 MB
            fileFilter: (req, file, callback) => {                              // 限制圖片格式
                if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                    callback(null, false);
                    return ErrorService.appError(401, "圖片格式只接受 jpg、jpeg、png！", next);

                } else if (file.size > 1048576) { // 驗證檔案大小
                    callback(null, false);
                    return ErrorService.appError(401, "上傳檔案限1MB！", next);

                } else {
                    // 接受該檔案
                    callback(null, true);
                };
            },
        }).single("image")(req, res, next);
    };



    // 檔案驗證
    uploadFileValidator = (req: Request, res: Response, next: NextFunction) => {
        return multer({
            limits: { fileSize: 1 * 1024 * 1024 },                              // 限制上傳檔案的大小為 1 MB
            fileFilter: (req, file, callback) => {                              // 限制圖片格式
                if (file.size > 1048576) { // 驗證檔案大小
                    callback(null, false);
                    return ErrorService.appError(401, "上傳檔案限1MB！", next);

                } else {
                    // 接受該檔案
                    callback(null, true);
                };
            },
        }).single("image")(req, res, next);
    };




}



export default new UploadController();
