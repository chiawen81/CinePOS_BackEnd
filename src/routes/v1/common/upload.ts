const express = require('express');
const router = express.Router();
import firebaseAdmin from '../../../service/firebase-admin';
import multer from 'multer';
import uuid from 'uuid';

const bucket = firebaseAdmin.storage().bucket();


const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024,  // 5MB
    },
});



// ———————————————  上傳檔案  ———————————————
router.post('/image', upload.single('file'), function (req, res) {
    console.log(111);
    console.log('bucket:', bucket);

    const file = req.file;                                              // 取得上傳的檔案資訊
    const uniqueId = uuid.v4();                                         // 產生唯一識別碼
    const fileName = uniqueId + '-' + file.originalname;
    const blob = bucket.file(fileName);                                 // 基於檔案的原始名稱建立一個 blob 物件
    const blobStream = blob.createWriteStream();                        // 建立一個可以寫入 blob 的物件
    console.log(file);

    // 監聽上傳狀態，當上傳完成時，會觸發 finish 事件
    blobStream.on('finish', () => {
        // res.send('上傳成功');
        // 設定檔案的存取權限
        const config = {
            action: 'read', // 權限
            expires: '12-31-2030', // 網址的有效期限
        };
        // 取得檔案的網址
        blob.getSignedUrl(config, async (err, imgUrl) => {
            console.log('檔案網址', imgUrl);

            // ==== 先找到該使用者 ====
            // const newUser = await User.create({
            //     stickerUrl: imgUrl,
            //     stickerFileName: fileName
            // });

            res.send({
                message: '上傳成功',
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
});



// ———————————————  刪除檔案  ———————————————
router.delete('/image', function (req, res) {
    const fileName = req.query.fileName;        // 取得檔案名稱
    const blob = bucket.file(fileName);         // 取得檔案

    // 刪除檔案
    blob.delete().then(() => {
        res.send('刪除成功');
    }).catch((err) => {
        res.status(500).send('刪除失敗');
    });
});



export const UploadRouter = router;