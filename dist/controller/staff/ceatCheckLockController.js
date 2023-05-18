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
const seatsModels_1 = __importDefault(require("../../models/common/seatsModels"));
const error_1 = __importDefault(require("./../../service/error"));
class SeatCheckLockController {
    constructor() {
        this.seatCheckLock = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const seats = yield seatsModels_1.default.find({ scheduleId: req.body.scheduleId });
                if (!seats) {
                    return next(error_1.default.appError(404, "沒有這筆場次資料！", next));
                }
                ;
                const reqSeats = req.body.seats;
                const seatFail = [];
                reqSeats.forEach(reqSeatsItem => {
                    seats.forEach((seatsItem) => __awaiter(this, void 0, void 0, function* () {
                        if (reqSeatsItem === seatsItem.seatName) {
                            if (seatsItem.status !== 0) {
                                seatFail.push(seatsItem.seatName);
                            }
                        }
                    }));
                });
                if (seatFail.length > 0) {
                    return next(error_1.default.appError(400, `${seatFail} 無法選取請重新選擇座位`, next));
                }
                yield seatsModels_1.default.updateMany({ seatName: { $in: reqSeats } }, { $set: { status: 2 } });
                res.status(200).json({
                    code: 1,
                    message: "成功鎖定座位!",
                    data: reqSeats
                });
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || "檢查座位是否有被鎖住錯誤(其它)!",
                });
            }
            ;
        });
    }
}
exports.default = new SeatCheckLockController();
