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
const usersModels_1 = __importDefault(require("../models/usersModels"));
const error_1 = __importDefault(require("../service/error"));
const auth_1 = __importDefault(require("../service/auth"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class LogInController {
    constructor() {
        this.lonIn = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log('進來登入了～');
            let { staffId, password } = req.body;
            console.log('staffId', staffId, 'password', password);
            let passwordValidator = validator_1.default.isLength(password, { min: 8 });
            let staffIdValidator = validator_1.default.isLength(staffId, { min: 5 });
            console.log('passwordValidator', passwordValidator, 'staffIdValidator', staffIdValidator);
            if (passwordValidator && staffIdValidator) {
                const user = yield usersModels_1.default.findOne({ staffId }).select('+password');
                console.log('user', user, user.name, user.password);
                console.log('password', password, 'user.password', user.password);
                const result = yield bcryptjs_1.default.compare(password, user.password);
                if (result) {
                    console.log('身份證確');
                    auth_1.default.sendBackJWT(user, res, 200);
                }
                else {
                    return next(error_1.default.appError(200, "欄位驗證錯誤！", next));
                }
                ;
            }
            else {
                console.log(2);
                return next(error_1.default.appError(200, "欄位驗證錯誤！", next));
            }
            ;
        });
    }
}
exports.default = new LogInController();
