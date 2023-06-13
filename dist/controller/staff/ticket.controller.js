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
const ticketModels_1 = __importDefault(require("../../models/ticketModels"));
class TicketController {
    constructor() {
        this.createTicket = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield ticketModels_1.default.insertMany(req.body.ticketData);
                let ticketIdArr = [];
                result.forEach(item => {
                    ticketIdArr.push(item.id);
                });
                res.status(200).json({
                    code: 1,
                    message: "成功新增電影票",
                    data: ticketIdArr
                });
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || "新增票種錯誤(其它)!",
                });
            }
        });
        this.updateTicketStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const reqArr = req.body;
                for (let i = 0; i < reqArr.length; i++) {
                    yield ticketModels_1.default.findByIdAndUpdate(reqArr[i].id, {
                        "isRefund": reqArr[i].isRefund,
                        "refundMethod": reqArr[i].refundMethod
                    });
                }
                const resData = req.body;
                res.status(200).json({
                    code: 1,
                    message: "成功修改電影票狀態!",
                });
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || "更新電影票狀態錯誤(其它)!",
                });
            }
            ;
        });
    }
}
exports.default = new TicketController();
