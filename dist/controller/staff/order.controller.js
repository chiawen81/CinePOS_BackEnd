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
exports.EnumOrderStatus = exports.EnumSeatStatus = void 0;
const error_1 = __importDefault(require("../../service/error"));
const orderModels_1 = __importDefault(require("../../models/orderModels"));
const seats_model_1 = __importDefault(require("../../models/seats.model"));
const ticketModels_1 = __importDefault(require("../../models/ticketModels"));
const ticketTypeModels_1 = __importDefault(require("../../models/ticketTypeModels"));
const mongoose = require('mongoose');
const uuid = require('uuid');
class OrderController {
    constructor() {
        this.createOrder = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let orderId = uuid.v4();
            let ticketTypeData;
            let isParaValid = this.isCreateOrderParaValid(req.body);
            if (!isParaValid.valid) {
                return next(error_1.default.appError(400, isParaValid.errMsg, next));
            }
            ;
            console.log('通過驗證！');
            try {
                ticketTypeData = yield ticketTypeModels_1.default.find({});
                console.log('ticketType全部資料', ticketTypeData);
                this.getNewOrderDataAndUpdateSeatDatabase(req.body, orderId)
                    .then((newOrderData) => {
                    console.log('newOrderData-主程式', newOrderData);
                    return orderModels_1.default.create(newOrderData);
                })
                    .then((newOrderData) => {
                    console.log('newOrderData-新增order資料庫', newOrderData);
                    let successData = this.setCreateOrderSuccessData(req.body, ticketTypeData, orderId);
                    console.log('successData-res', successData);
                    res.status(200).json({
                        code: 1,
                        message: "結帳成功!",
                        data: successData
                    });
                    return newOrderData;
                })
                    .then((newOrderData) => {
                    console.log('newOrderData-新增order資料庫', newOrderData);
                    this.updateTicketDatabase(newOrderData, next);
                })
                    .catch((err) => {
                    return next(this.createOrderError(req.body, orderId, 500, `結帳過程發生錯誤！已更新資料庫${err.message}`, next));
                });
            }
            catch (err) {
                return next(this.createOrderError(req.body, orderId, 500, `結帳過程發生錯誤！已更新資料庫${err.message}`, next));
            }
            ;
        });
        this.createOrderError = (reqData, orderId, httpStatus, errMessage, next) => {
            const error = new Error(errMessage);
            error.statusCode = httpStatus;
            error.isOperational = true;
            error.errMessage = errMessage;
            console.log('appError', httpStatus, errMessage);
            this.updateOrderDatabaseStatus(orderId, EnumOrderStatus.PAYMENT_FAILED);
            for (const reqTicketData of reqData.ticketList) {
                this.updateSeatDatabaseStatus(reqTicketData, EnumSeatStatus.FREE);
                this.updateTicketDatabaseOrderId(orderId, reqTicketData.ticketId);
            }
            ;
            next(error);
        };
        this.getOrder = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        });
    }
    updateTicketDatabase(newOrderData, next) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const val of newOrderData.ticketList) {
                console.log('valvalval', val);
                try {
                    let ticketData = yield ticketModels_1.default.findOneAndUpdate({ _id: val.ticketId }, { orderId: newOrderData.orderId }, { new: true });
                    console.log('ticketData', ticketData);
                }
                catch (err) {
                    return next(error_1.default.appError(500, `更新票券資料庫過程發生錯誤！發生錯誤的ticketId:${val.ticketId}`, next));
                }
                ;
            }
            ;
        });
    }
    setCreateOrderSuccessData(reqData, ticketTypeData, orderId) {
        console.log('newOrderData-要回傳給前端的資料', reqData, ticketTypeData);
        let ticketList = [];
        for (const newTicket of reqData.ticketList) {
            let targetTicketType;
            ticketTypeData.forEach(val => {
                if (val._id.toString() == newTicket.ticketTypeId) {
                    targetTicketType = val;
                }
                ;
            });
            console.log('targetTicketType', targetTicketType);
            ticketList.push({
                ticketId: newTicket.ticketId.toString(),
                type: targetTicketType.type,
                seatName: newTicket.seatName
            });
        }
        ;
        let successData = {
            orderId: orderId,
            paymentMethod: reqData.paymentMethod,
            amount: reqData.amount,
            ticketList: ticketList
        };
        console.log('successData', successData);
        return successData;
    }
    getNewOrderDataAndUpdateSeatDatabase(reqData, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            let newOrderData;
            let newOrderTicketList = [];
            console.log('reqData-整理要寫進order資料庫的資料', reqData);
            for (const reqTicketData of reqData.ticketList) {
                console.log('搜尋seatData 條件', { _id: reqTicketData.scheduleId, seatName: reqTicketData.seatName });
                let seatData = yield seats_model_1.default.findOneAndUpdate({ scheduleId: reqTicketData.scheduleId, seatName: reqTicketData.seatName }, { status: EnumSeatStatus.SOLD }, { new: true });
                console.log('找到seatData', seatData);
                let newOrderObj = {
                    ticketId: new mongoose.Types.ObjectId(reqTicketData.ticketId),
                    seatId: seatData._id,
                    price: reqTicketData.price,
                    ticketTypeId: new mongoose.Types.ObjectId(reqTicketData.ticketTypeId),
                    movieId: new mongoose.Types.ObjectId(reqTicketData.movieId),
                    scheduleId: new mongoose.Types.ObjectId(reqTicketData.scheduleId)
                };
                newOrderTicketList.push(newOrderObj);
            }
            ;
            newOrderData = {
                orderId: orderId,
                status: EnumOrderStatus.PAID,
                paymentMethod: reqData.paymentMethod,
                amount: reqData.amount,
                ticketList: newOrderTicketList,
            };
            console.log('newOrderData', newOrderData);
            return newOrderData;
        });
    }
    isCreateOrderParaValid(reqData) {
        let result = { valid: true, errMsg: "" };
        if (!reqData.paymentMethod) {
            return result = { valid: false, errMsg: "未填寫付款方式" };
        }
        ;
        if (!reqData.amount) {
            return result = { valid: false, errMsg: "未填寫總金額" };
        }
        ;
        if (reqData.ticketList.length === 0) {
            return result = { valid: false, errMsg: "未填寫票券資訊" };
        }
        else {
            (reqData.ticketList).forEach(data => {
                if (!data.ticketId) {
                    return result = { valid: false, errMsg: "有票券資訊未填寫票券ID" };
                }
                ;
                if (!data.price) {
                    return result = { valid: false, errMsg: "有票券資訊未填寫金額" };
                }
                ;
                if (!data.ticketTypeId) {
                    return result = { valid: false, errMsg: "有票券資訊未填寫票種ID" };
                }
                ;
                if (!data.movieId) {
                    return result = { valid: false, errMsg: "有票券資訊未填寫電影ID" };
                }
                ;
                if (!data.scheduleId) {
                    return result = { valid: false, errMsg: "有票券資訊未填寫場次ID" };
                }
                ;
            });
        }
        ;
        return result;
    }
    updateSeatDatabaseStatus(reqTicketData, status) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('搜尋seatData 條件', { _id: reqTicketData.scheduleId, seatName: reqTicketData.seatName });
            let seatData = yield seats_model_1.default.findOneAndUpdate({ scheduleId: reqTicketData.scheduleId, seatName: reqTicketData.seatName }, { status: status }, { new: true });
            console.log('找到seatData', seatData);
        });
    }
    ;
    updateOrderDatabaseStatus(orderId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            let OrderData = yield orderModels_1.default.find({ _id: orderId });
            if (OrderData) {
                yield orderModels_1.default.findOneAndUpdate({ _id: orderId }, { status: status }, { new: true });
            }
            ;
            console.log('更新訂單狀態', OrderData);
        });
    }
    ;
    updateTicketDatabaseOrderId(orderId, ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ticketData = yield ticketModels_1.default.find({ _id: ticketId });
            console.log('ticketData', ticketData);
            if (ticketData) {
                let updateTicketData = yield ticketModels_1.default.findOneAndUpdate({ _id: ticketId }, { orderId: orderId }, { new: true });
                console.log('updateTicketData', updateTicketData);
            }
            ;
        });
    }
}
exports.default = new OrderController();
var EnumSeatStatus;
(function (EnumSeatStatus) {
    EnumSeatStatus[EnumSeatStatus["FREE"] = 0] = "FREE";
    EnumSeatStatus[EnumSeatStatus["SOLD"] = 1] = "SOLD";
    EnumSeatStatus[EnumSeatStatus["LOCKED"] = 2] = "LOCKED";
    EnumSeatStatus[EnumSeatStatus["NONE"] = 3] = "NONE";
})(EnumSeatStatus = exports.EnumSeatStatus || (exports.EnumSeatStatus = {}));
var EnumOrderStatus;
(function (EnumOrderStatus) {
    EnumOrderStatus[EnumOrderStatus["PAYMENT_FAILED"] = -1] = "PAYMENT_FAILED";
    EnumOrderStatus[EnumOrderStatus["UNPAID"] = 0] = "UNPAID";
    EnumOrderStatus[EnumOrderStatus["PAID"] = 1] = "PAID";
    EnumOrderStatus[EnumOrderStatus["PAYMENT_IN_PROGRESS"] = 2] = "PAYMENT_IN_PROGRESS";
    EnumOrderStatus[EnumOrderStatus["REFUNDED"] = 3] = "REFUNDED";
})(EnumOrderStatus = exports.EnumOrderStatus || (exports.EnumOrderStatus = {}));
