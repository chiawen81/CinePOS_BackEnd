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
const usersModels_1 = __importDefault(require("../models/usersModels"));
const error_1 = __importDefault(require("../service/error"));
class UserController {
    constructor() {
        this.changeUserName = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log("抓到路由- user/info/update");
            const { newName, staffId } = req.body;
            if (!validator_1.default.isLength(newName, { min: 2 })) {
                return next(error_1.default.appError(400, "姓名欄位驗證錯誤！", next));
            }
            ;
            let role = (req.originalUrl.split('/')[1] === "admin") ? "manager" : "staff";
            const user = yield usersModels_1.default.findOne({ staffId, role }).select('+password');
            if (!user) {
                return next(error_1.default.appError(400, "查無此人！", next));
            }
            ;
            try {
                const updatedUser = yield usersModels_1.default.findOneAndUpdate({ staffId }, { name: newName }, { new: true });
                console.log('updatedUser ', updatedUser);
                if (!updatedUser) {
                    return next(error_1.default.appError(400, "查無此人！", next));
                }
                ;
                res.status(200).json({
                    message: "已經成功修改姓名!",
                    data: {
                        staffId: updatedUser.staffId,
                        newName: updatedUser.name
                    }
                });
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
            ;
        });
    }
}
exports.default = new UserController();
