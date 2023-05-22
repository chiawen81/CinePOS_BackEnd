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
const timetable_model_1 = __importDefault(require("../../models/common/timetable.model"));
const seats_model_1 = __importDefault(require("../../models/common/seats.model"));
const error_1 = __importDefault(require("../../service/error"));
class ScheduleController {
    constructor() {
        this.getScheduleList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const startDate = Number(req.query.startDate);
                const endDate = Number(req.query.endDate);
                const schedule = yield timetable_model_1.default.find({
                    startDate: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                })
                    .populate({
                    path: 'movieId',
                    select: 'title title enTitle runtime rate posterUrl'
                })
                    .populate({
                    path: 'theaterId',
                    select: 'name type totalCapacity'
                });
                if (!schedule) {
                    return next(error_1.default.appError(404, "沒有這筆場次資料！", next));
                }
                let resData = [];
                schedule.forEach(scheduleItem => {
                    const findResData = resData.find(element => element.movieId === String(scheduleItem.movieId['id']));
                    if (!!findResData) {
                        findResData.scheduleList.push(this.scheduleListData(scheduleItem));
                    }
                    else {
                        const scheduleList = [
                            this.scheduleListData(scheduleItem)
                        ];
                        resData.push({
                            movieId: String(scheduleItem.movieId['id']),
                            title: scheduleItem.movieId['title'],
                            posterUrl: scheduleItem.movieId['posterUrl'],
                            runtime: scheduleItem.movieId['runtime'],
                            rate: scheduleItem.movieId['rate'],
                            scheduleList: scheduleList
                        });
                    }
                });
                for (let i = 0; i < resData.length; i++) {
                    for (let j = 0; j < resData[i].scheduleList.length; j++) {
                        const seats = yield seats_model_1.default.find({ scheduleId: resData[i].scheduleList[j].scheduleId, status: { $ne: 0 } });
                        const seatsSold = seats.filter(item => item.status === 1);
                        resData[i].scheduleList[j].remainSeats = resData[i].scheduleList[j].totalCapacity - seatsSold.length;
                    }
                }
                res.status(200).json({
                    code: 1,
                    message: "成功取得場次",
                    data: resData
                });
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || "取得場次錯誤(其它)!",
                });
            }
            ;
        });
    }
    scheduleListData(scheduleItem) {
        return {
            scheduleId: scheduleItem.id,
            time: scheduleItem.startTime,
            theater: scheduleItem.theaterId.name,
            theaterType: scheduleItem.theaterId.type,
            totalCapacity: scheduleItem.theaterId.totalCapacity
        };
    }
}
exports.default = new ScheduleController();
