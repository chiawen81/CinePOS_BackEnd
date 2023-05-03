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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadRouter = void 0;
const express = require('express');
const router = express.Router();
const firebase_admin_1 = __importDefault(require("../../../service/firebase-admin"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = __importDefault(require("uuid"));
const bucket = firebase_admin_1.default.storage().bucket();
const upload = (0, multer_1.default)({
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
router.post('/image', upload.single('file'), function (req, res) {
    console.log(111);
    console.log('bucket:', bucket);
    const file = req.file;
    const uniqueId = uuid_1.default.v4();
    const fileName = uniqueId + '-' + file.originalname;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();
    console.log(file);
    blobStream.on('finish', () => {
        const config = {
            action: 'read',
            expires: '12-31-2030',
        };
        blob.getSignedUrl(config, (err, imgUrl) => __awaiter(this, void 0, void 0, function* () {
            console.log('檔案網址', imgUrl);
            res.send({
                message: '上傳成功',
                fileName: fileName,
                imgUrl
            });
        }));
    });
    blobStream.on('error', (err) => {
        console.error(err);
        res.status(500).send(`上傳失敗：${err.message}`);
    });
    blobStream.end(file.buffer);
});
router.delete('/image', function (req, res) {
    const fileName = req.query.fileName;
    const blob = bucket.file(fileName);
    blob.delete().then(() => {
        res.send('刪除成功');
    }).catch((err) => {
        res.status(500).send('刪除失敗');
    });
});
exports.UploadRouter = router;
