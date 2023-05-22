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
const error_1 = __importDefault(require("../../service/error"));
const ticketTypeModels_1 = __importDefault(require("../../models/staff/ticketTypeModels"));
class TicketTypeController {
    constructor() {
        this.getTicketType = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const ticketType = yield ticketTypeModels_1.default.find({});
                res.status(200).json({
                    code: 1,
                    message: "成功取得票種",
                    data: ticketType
                });
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || "取得票種錯誤(其它)!",
                });
            }
            ;
        });
        this.createTicketType = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const ticketType = yield ticketTypeModels_1.default.findOne({ type: req.body.type });
                if (!!ticketType) {
                    return next(error_1.default.appError(404, "已有相同票種", next));
                }
                yield ticketTypeModels_1.default.create({
                    type: req.body.type,
                    price: req.body.price,
                });
                res.status(200).json({
                    code: 1,
                    message: "成功新增票種",
                    data: null
                });
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || "新增票種錯誤(其它)!",
                });
            }
            ;
        });
    }
}
exports.default = new TicketTypeController();
