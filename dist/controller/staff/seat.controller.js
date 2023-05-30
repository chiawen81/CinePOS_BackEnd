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
const seats_model_1 = __importDefault(require("../../models/common/seats.model"));
const error_1 = __importDefault(require("../../service/error"));
const timetable_model_1 = __importDefault(require("../../models/common/timetable.model"));
class SeatController {
    constructor() {
        this.getScheduleIdSeat = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const scheduleTheaters = yield timetable_model_1.default
                    .findByIdAndUpdate(req.params.scheduleId)
                    .populate({
                    path: 'theaterId',
                    select: 'name totalCapacity row col rowLabel colLabel seatMap'
                });
                if (!scheduleTheaters.theaterId) {
                    return next(error_1.default.appError(404, "沒有這筆場次座位資料！", next));
                }
                const seatMap = scheduleTheaters.theaterId['seatMap'];
                const seats = yield seats_model_1.default.find({ scheduleId: req.params.scheduleId, status: { $ne: 0 } });
                if (!seats) {
                    return next(error_1.default.appError(404, "座位資料錯誤！", next));
                }
                const seatsSold = seats.filter(item => item.status === 1);
                let list = [];
                scheduleTheaters.theaterId['rowLabel'].forEach((row, rowIndex) => {
                    let seat = [];
                    let j = 0;
                    if (!!row) {
                        for (let i = scheduleTheaters.theaterId['col'] * rowIndex; i <= (scheduleTheaters.theaterId['col'] * (rowIndex + 1)) - 1; i++) {
                            j++;
                            seat.push({
                                cols: scheduleTheaters.theaterId['colLabel'][j - 1],
                                status: 0,
                                type: seatMap[i]
                            });
                        }
                        list.push({
                            rows: row,
                            seat: seat
                        });
                    }
                    else {
                        list.push({
                            rows: 'none'
                        });
                    }
                });
                seats.forEach(seatsItem => {
                    list.forEach(listItem => {
                        if (listItem.rows === seatsItem.seatRow) {
                            listItem.seat[Number(seatsItem.seatCol) - 1].status = seatsItem.status;
                        }
                    });
                });
                const resData = {
                    sold: seatsSold.length,
                    free: scheduleTheaters.theaterId['totalCapacity'] - seatsSold.length,
                    maxRows: scheduleTheaters.theaterId['row'],
                    maxColumns: scheduleTheaters.theaterId['col'],
                    rowLabel: scheduleTheaters.theaterId['rowLabel'],
                    colLabel: scheduleTheaters.theaterId['colLabel'],
                    list: list
                };
                res.status(200).json({
                    code: 1,
                    message: "OK",
                    data: resData
                });
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || "取得場次座位表錯誤(其它)!",
                });
            }
            ;
        });
        this.seatCheckLock = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const seats = yield seats_model_1.default.find({ scheduleId: req.body.scheduleId });
                if (!seats) {
                    return next(error_1.default.appError(404, "沒有這筆場次資料！", next));
                }
                ;
                const reqSeats = req.body.seats;
                const seatFail = [];
                const seatSuccess = [];
                reqSeats.forEach(reqSeatsItem => {
                    seats.forEach((seatsItem) => __awaiter(this, void 0, void 0, function* () {
                        if (reqSeatsItem === seatsItem.seatName) {
                            if (seatsItem.status !== 0) {
                                seatFail.push(seatsItem.seatName);
                            }
                            else {
                                seatSuccess.push({
                                    seatId: seatsItem.id,
                                    seatName: seatsItem.seatName
                                });
                            }
                        }
                    }));
                });
                if (seatFail.length > 0) {
                    return next(error_1.default.appError(400, `${seatFail} 無法選取請重新選擇座位`, next));
                }
                yield seats_model_1.default.updateMany({ seatName: { $in: reqSeats } }, { $set: { status: 2 } });
                res.status(200).json({
                    code: 1,
                    message: "成功鎖定座位!",
                    data: seatSuccess
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
exports.default = new SeatController();
