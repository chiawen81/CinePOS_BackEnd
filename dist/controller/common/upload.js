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
const firebase_admin_1 = __importDefault(require("../../service/firebase-admin"));
const multer_1 = __importDefault(require("multer"));
const error_1 = __importDefault(require("./../../service/error"));
const uuid = require('uuid');
class UploadController {
    constructor() {
        this.upload = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('req.file', req.file);
                const bucket = firebase_admin_1.default.storage().bucket();
                const file = req.file;
                const uniqueId = uuid.v4();
                const fileName = uniqueId + '-' + file.originalname;
                const blob = bucket.file(fileName);
                const blobStream = blob.createWriteStream();
                blobStream.on('finish', () => __awaiter(this, void 0, void 0, function* () {
                    const config = {
                        action: 'read',
                        expires: '12-31-2030',
                    };
                    blob.getSignedUrl(config, (err, imgUrl) => __awaiter(this, void 0, void 0, function* () {
                        console.log('檔案網址', imgUrl);
                        req.fileData = { fileName, err, imgUrl, file };
                        next();
                    }));
                }));
                blobStream.on('error', (err) => {
                    res.status(500).send(`上傳失敗(系統報錯)：${err.message}`);
                });
                blobStream.end(file.buffer);
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || "上傳檔案錯誤！"
                });
            }
            ;
        });
        this.deleteFile = function deleteFile(req, res, next, fileName) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log('刪除檔案');
                    const bucket = firebase_admin_1.default.storage().bucket();
                    const blob = bucket.file(fileName);
                    blob.delete().then(() => {
                        console.log('刪除成功');
                    }).catch((err) => {
                        console.log('刪除失敗');
                    });
                }
                catch (err) {
                    res.status(500).json({
                        code: -1,
                        message: err.message || "刪除檔案錯誤！"
                    });
                }
                ;
            });
        };
        this.photoValidator = (req, res, next) => {
            return (0, multer_1.default)({
                limits: { fileSize: 1 * 1024 * 1024 },
                fileFilter: (req, file, callback) => {
                    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                        callback(null, false);
                        return error_1.default.appError(401, "圖片格式只接受 jpg、jpeg、png！", next);
                    }
                    else if (file.size > 1048576) {
                        callback(null, false);
                        return error_1.default.appError(401, "上傳檔案限1MB！", next);
                    }
                    else {
                        callback(null, true);
                    }
                    ;
                },
            }).single("image")(req, res, next);
        };
        this.uploadFileValidator = (req, res, next) => {
            return (0, multer_1.default)({
                limits: { fileSize: 1 * 1024 * 1024 },
                fileFilter: (req, file, callback) => {
                    if (file.size > 1048576) {
                        callback(null, false);
                        return error_1.default.appError(401, "上傳檔案限1MB！", next);
                    }
                    else {
                        callback(null, true);
                    }
                    ;
                },
            }).single("image")(req, res, next);
        };
    }
}
exports.default = new UploadController();
