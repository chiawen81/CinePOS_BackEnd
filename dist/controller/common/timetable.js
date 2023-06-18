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
const timetable_model_1 = __importDefault(require("../../models/timetable.model"));
const error_1 = __importDefault(require("./../../service/error"));
const theater_1 = __importDefault(require("../manager/theater"));
const seats_model_1 = __importDefault(require("../../models/seats.model"));
const theater_model_1 = __importDefault(require("../../models/theater.model"));
class TimetableController {
    constructor() {
        this.getList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log("get timetable list");
            const startDate = Number(req.query.startDate);
            const endDate = Number(req.query.endDate);
            if (!startDate && !endDate) {
                try {
                    const timetable = yield timetable_model_1.default.find()
                        .populate({
                        path: 'movieId',
                        select: 'title rate runtime'
                    })
                        .populate({
                        path: 'theaterId',
                        select: 'name'
                    });
                    res.status(200).json({
                        code: 1,
                        message: "成功",
                        data: {
                            timetable
                        }
                    });
                }
                catch (err) {
                    res.status(500).json({ error: err.message });
                }
                ;
            }
            else if (startDate && endDate) {
                try {
                    const timetable = yield timetable_model_1.default.find({
                        startDate: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate),
                        },
                    })
                        .populate({
                        path: 'movieId',
                        select: 'title rate runtime'
                    })
                        .populate({
                        path: 'theaterId',
                        select: 'name'
                    });
                    console.log('timetable', timetable);
                    res.status(200).json({
                        code: 1,
                        message: "成功",
                        data: {
                            timetable
                        }
                    });
                }
                catch (err) {
                    res.status(500).json({ error: err.message });
                }
                ;
            }
            else if (!startDate || !endDate) {
                return next(error_1.default.appError(400, "缺少必要欄位", next));
            }
            ;
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log("create timetable entry");
            const request = req.body;
            console.log(request);
            if (!request) {
                return next(error_1.default.appError(400, "缺少必要欄位或格式不正確", next));
            }
            try {
                const timetable = yield timetable_model_1.default.create({
                    movieId: request.movieId,
                    theaterId: request.theaterId,
                    startDate: new Date(request.startDate),
                    endDate: new Date(request.endDate),
                });
                yield timetable.save();
                let theaterData = yield theater_model_1.default.findOne({ _id: request.theaterId });
                if (theaterData) {
                    let seatRow = theater_1.default.splitArrayIntoChunks(theaterData.seatMap, theaterData.row);
                    const dataArray = [];
                    for (let i = 0; i < seatRow.length; i++) {
                        let colCount = 0;
                        seatRow[i].forEach(element => {
                            if (element == "0" || element == "1") {
                                const seat = {
                                    scheduleId: timetable._id,
                                    seatRow: theaterData.rowLabel[i],
                                    seatCol: theaterData.colLabel[colCount],
                                    seatName: theaterData.rowLabel[i] + theaterData.colLabel[colCount] + "",
                                    status: 0
                                };
                                dataArray.push(seat);
                            }
                            else if (element === "-1") {
                                const seat = {
                                    scheduleId: timetable._id,
                                    seatRow: theaterData.rowLabel[i],
                                    seatCol: theaterData.colLabel[colCount],
                                    seatName: theaterData.rowLabel[i] + theaterData.colLabel[colCount] + "",
                                    status: 3
                                };
                                dataArray.push(seat);
                            }
                            colCount++;
                        });
                    }
                    yield seats_model_1.default.insertMany(dataArray);
                }
                res.status(200).json({
                    code: 1,
                    message: "成功",
                    data: {
                        timetable,
                    },
                });
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log("update all timetable entries");
            const timetable = req.body;
            const id = timetable.id;
            if (!timetable) {
                return next(error_1.default.appError(400, "缺少必要欄位或格式不正確", next));
            }
            try {
                const updatedTimetable = yield timetable_model_1.default.findByIdAndUpdate(id, {
                    movieId: timetable.movieId,
                    theaterId: timetable.theaterId,
                    startDate: new Date(timetable.startDate),
                    endDate: new Date(timetable.endDate),
                }, { new: true });
                console.log('update', updatedTimetable);
                res.status(200).json({
                    code: 1,
                    message: "成功",
                    data: {
                        timetable: updatedTimetable,
                    },
                });
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log("delete timetable entry");
            const timetableId = req.params.timetableId;
            if (!timetableId) {
                return next(error_1.default.appError(400, "缺少必要欄位", next));
            }
            try {
                const deletedTimetable = yield timetable_model_1.default.findByIdAndDelete(timetableId);
                const deletedSeats = yield seats_model_1.default.deleteMany({
                    scheduleId: timetableId
                });
                if (!deletedTimetable) {
                    return next(error_1.default.appError(404, "找不到指定的時刻表", next));
                }
                console.log(deletedTimetable, deletedSeats);
                res.status(200).json({
                    code: 1,
                    message: "時刻表已成功刪除！",
                    data: {
                        deletedTimetable,
                    },
                });
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
    }
}
exports.default = new TimetableController();
