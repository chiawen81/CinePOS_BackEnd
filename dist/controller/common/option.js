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
const optionsModels_1 = __importDefault(require("../../models/common/optionsModels"));
const error_1 = __importDefault(require("./../../service/error"));
class OptionController {
    constructor() {
        this.getOptionData = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let typeId = Number(req.params['typeId']);
            let optionData = [];
            console.log('id', typeId);
            if (!typeId) {
                return next(error_1.default.appError(401, "請輸入要查詢的選項欄位代碼！", next));
            }
            ;
            optionData = yield optionsModels_1.default.find({ typeId });
            console.log('option', optionData);
            try {
                if (optionData.length) {
                    res.status(200).json({
                        code: 1,
                        message: "成功取得選項資料!",
                        data: optionData
                    });
                }
                else {
                    return next(error_1.default.appError(401, "查無資料！請確認是否正確輸入要查詢的選項欄位代碼！", next));
                }
                ;
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || "更新姓名錯誤(其它)!",
                });
            }
            ;
        });
    }
}
exports.default = new OptionController();
