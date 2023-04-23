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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = __importDefault(require("../service/error"));
const usersModels_1 = __importDefault(require("../models/usersModels"));
class AuthService {
    constructor() {
        this.sendBackJWT = (reqData, res, statusCode) => {
            console.log(reqData._id);
            const token = jsonwebtoken_1.default.sign({ id: reqData._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_DAY
            });
            res.status(statusCode).json({
                status: 'success',
                statusCode,
                user: {
                    token,
                    name: reqData.name
                }
            });
        };
        this.isAuth = error_1.default.handleErrorAsync((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let token;
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
                console.log('目前使用的token', token);
            }
            else {
                return next(error_1.default.appError(401, "請重新登入！", next));
            }
            ;
            const decodedClientData = yield new Promise((resolve, reject) => {
                jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, payload) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        console.log('payload', payload);
                        resolve(payload);
                    }
                    ;
                });
            });
            console.log('decodedClientData', decodedClientData);
            const currentUser = yield usersModels_1.default.findOne({ id: decodedClientData.id });
            console.log('currentUser', currentUser);
            req.user = currentUser;
            next();
        }));
    }
}
exports.default = new AuthService();
