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
                console.log('req.file', req["file"]);
                const bucket = firebase_admin_1.default.storage().bucket();
                const file = req["file"];
                const uniqueId = uuid.v4();
                const fileName = uniqueId + '-' + file.originalname;
                const blob = bucket.file(fileName);
                const blobStream = blob.createWriteStream();
                blobStream.on('finish', () => __awaiter(this, void 0, void 0, function* () {
                    const config = {
                        action: 'read',
                        expires: '12-31-2030',
                    };
                    blob.getSignedUrl(config, (err, fileUrl) => __awaiter(this, void 0, void 0, function* () {
                        console.log('檔案網址', fileUrl);
                        req["fileData"] = { fileName, err, fileUrl, file };
                        next();
                    }));
                }));
                blobStream.on('error', (err) => {
                    res.status(500).send(`上傳失敗(firebase相關錯誤)：${err.message}`);
                });
                blobStream.end(file.buffer);
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || "上傳檔案錯誤（其它）！"
                });
            }
            ;
        });
        this.getUploadSuccessInfo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            res.send({
                code: 1,
                message: '上傳成功！',
                data: {
                    fileName: req["fileData"].fileName,
                    fileUrl: req["fileData"].fileUrl,
                    fileSize: req["fileData"].file.size,
                }
            });
        });
        this.deleteFile = function deleteFile(req, res, next, fileName) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!fileName) {
                    return next(error_1.default.appError(401, "請輸入要刪除的檔案名稱！", next));
                }
                ;
                try {
                    console.log('刪除檔案');
                    const bucket = firebase_admin_1.default.storage().bucket();
                    const blob = bucket.file(fileName);
                    blob.delete().then(() => {
                        console.log('刪除成功!');
                    }).catch((err) => {
                        console.log('刪除失敗!請確認正確是否填寫檔案完整名稱！');
                    });
                }
                catch (err) {
                    res.status(500).json({
                        code: -1,
                        message: err.message || "刪除檔案錯誤（其它）！"
                    });
                }
                ;
            });
        };
        this.uploadValidator = (req, res, next) => {
            let fileType = req.query["fileType"];
            console.log('驗證上傳檔案- 檔案驗證fileType', fileType);
            try {
                if (fileType === "image") {
                    this.photoValidator(req, res, next);
                }
                else if (fileType === "other") {
                    this.fileValidator(req, res, next);
                }
                else {
                    res.status(500).json({
                        code: -1,
                        message: "辨別上傳類型錯誤！"
                    });
                }
                ;
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || "驗證上傳檔案錯誤(其它)！"
                });
            }
            ;
        };
    }
    photoValidator(req, res, next) {
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
        }).single("upload")(req, res, next);
    }
    fileValidator(req, res, next) {
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
        }).single("upload")(req, res, next);
    }
}
exports.default = new UploadController();
