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
const validator_1 = __importDefault(require("validator"));
const usersModels_1 = __importDefault(require("../../models/common/usersModels"));
const error_1 = __importDefault(require("./../../service/error"));
const upload_1 = __importDefault(require("./../../controller/common/upload"));
class UserController {
    constructor() {
        this.getUserProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log("getUserProfile");
            try {
                const { staffId } = req.user;
                let role = (req.originalUrl.split('/')[2] === "manager") ? "manager" : "staff";
                const user = yield usersModels_1.default.findOne({ staffId, role }).select('+password');
                res.status(200).json({
                    code: 1,
                    message: "成功取得使用者資料!",
                    data: {
                        staffId: user.staffId,
                        name: user.name,
                        role: user.role,
                        status: user.status,
                        stickerUrl: user.stickerUrl,
                        stickerFileName: user.stickerFileName,
                        createdAt: user.createdAt,
                    }
                });
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || "取得使用者資料(其它)!",
                });
            }
            ;
        });
        this.changeUserName = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log("抓到路由- profile");
            const { newName } = req.body;
            const { staffId } = req.user;
            console.log('newName', newName, 'staffId', staffId);
            if (!validator_1.default.isLength(newName, { min: 2 })) {
                return next(error_1.default.appError(401, "姓名欄位驗證錯誤！", next));
            }
            ;
            let role = (req.originalUrl.split('/')[2] === "manager") ? "manager" : "staff";
            const user = yield usersModels_1.default.findOne({ staffId, role }).select('+password');
            if (!user) {
                return next(error_1.default.appError(401, "查無此人！", next));
            }
            ;
            try {
                const updatedUser = yield usersModels_1.default.findOneAndUpdate({ staffId }, { name: newName }, { new: true });
                console.log('updatedUser ', updatedUser);
                if (!updatedUser) {
                    return next(error_1.default.appError(401, "查無此人！", next));
                }
                ;
                res.status(200).json({
                    code: 1,
                    message: "已經成功修改姓名!",
                    data: {
                        staffId: updatedUser.staffId,
                        newName: updatedUser.name
                    }
                });
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || "更新姓名錯誤(其它)!",
                });
            }
            ;
        });
        this.changeSticker = function changeSticker(req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('自訂義程式(更新大頭貼) 之我接到囉～');
                console.log('req.fileData', req.fileData);
                console.log('req.user', req.user);
                try {
                    let updateData = {
                        stickerUrl: req.fileData.imgUrl,
                        stickerFileName: req.fileData.fileName
                    };
                    let condition = { staffId: req.user.staffId };
                    const updatedUser = yield usersModels_1.default.findOneAndUpdate(condition, updateData, { new: true });
                    console.log('updatedUser ', updatedUser);
                    res.send({
                        code: 1,
                        message: '上傳成功！',
                        data: {
                            stickerFileName: updateData.stickerFileName,
                            stickerUrl: updateData.stickerUrl,
                        }
                    });
                    upload_1.default.deleteFile(req, res, next, req.user.stickerFileName);
                }
                catch (err) {
                    res.status(500).json({ error: err.message });
                }
                ;
            });
        };
    }
    filterTargetUser(condition, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield usersModels_1.default.findOne(condition).select('+password');
            console.log('比對使用者:', user);
            if (!user) {
                return next(error_1.default.appError(401, "查無此人！", next));
            }
            else {
                return user;
            }
            ;
        });
    }
}
exports.default = new UserController();
