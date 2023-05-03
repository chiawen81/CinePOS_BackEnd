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
const uuid_1 = __importDefault(require("uuid"));
class UploadController {
    constructor() {
        this.bucket = firebase_admin_1.default.storage().bucket();
        this.upload = (0, multer_1.default)({
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        });
    }
    uploadFile(req, res, next, onFinishFunc) {
        console.log('bucket:', this.bucket);
        const file = req.file;
        const uniqueId = uuid_1.default.v4();
        const fileName = uniqueId + '-' + file.originalname;
        const blob = this.bucket.file(fileName);
        const blobStream = blob.createWriteStream();
        console.log(file);
        blobStream.on('finish', () => {
            res.send('上傳成功');
            const config = {
                action: 'read',
                expires: '12-31-2030',
            };
            blob.getSignedUrl(config, (err, imgUrl) => __awaiter(this, void 0, void 0, function* () {
                onFinishFunc();
                res.send({
                    message: '上傳成功！',
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
    }
    ;
}
exports.default = new UploadController();
