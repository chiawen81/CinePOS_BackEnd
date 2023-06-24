import { Response, NextFunction } from 'express';
import Seat from '../../models/seats.model';
import ErrorService from '../../service/error';
import Timetable from '../../models/timetable.model';

interface seat {
    cols: string;
    status: number;
    type: string
}

interface list {
    rows: string;
    seat?: seat[]
}
class SeatController {
    constructor() {

    }
    // ———————————————————————  取得場次座位表  ———————————————————————
    getScheduleIdSeat = async (req, res: Response, next: NextFunction) => {
        try {

            const scheduleTheaters = await Timetable
                .findById(req.params.scheduleId)
                .populate({
                    path: 'theaterId',
                    select: 'name totalCapacity row col rowLabel colLabel seatMap'
                })
            if (!scheduleTheaters.theaterId) {
                return next(ErrorService.appError(404, "沒有這筆場次座位資料！", next));
            }
            const seatMap = scheduleTheaters.theaterId['seatMap'];
            const seats = await Seat.find({ scheduleId: req.params.scheduleId, status: { $ne: 0 } });
            if (!seats) {
                return next(ErrorService.appError(404, "座位資料錯誤！", next));
            }
            const seatsSold = seats.filter(item => item.status === 1);
            const seatsLock = seats.filter(item => item.status === 2);
            let list: list[] = [];
            scheduleTheaters.theaterId['rowLabel'].forEach((row, rowIndex) => {
                let seat: seat[] = [];
                let j = 0;
                if (!!row) {
                    for (let i = scheduleTheaters.theaterId['col'] * rowIndex; i <= (scheduleTheaters.theaterId['col'] * (rowIndex + 1)) - 1; i++) {
                        j++;
                        seat.push({
                            cols: scheduleTheaters.theaterId['colLabel'][j - 1],
                            status: 0,
                            type: seatMap[i]
                        })
                    }
                    list.push({
                        rows: row,
                        seat: seat
                    })
                } else {
                    list.push({
                        rows: 'none'
                    })
                }
            });
            seats.forEach(seatsItem => {
                list.forEach(listItem => {
                    if (listItem.rows === seatsItem.seatRow) {
                        listItem.seat.forEach((item) => {
                            if (item.cols === seatsItem.seatCol) {
                                item.status = seatsItem.status;
                            }
                        });
                    }

                });
            });
            const resData = {
                sold: seatsSold.length,
                lock: seatsLock.length,
                free: scheduleTheaters.theaterId['totalCapacity'] - seatsSold.length - seatsLock.length,
                maxRows: scheduleTheaters.theaterId['row'],
                maxColumns: scheduleTheaters.theaterId['col'],
                rowLabel: scheduleTheaters.theaterId['rowLabel'],
                colLabel: scheduleTheaters.theaterId['colLabel'],
                list: list
            }
            res.status(200).json({
                code: 1,
                message: "OK",
                data: resData
            });
        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "取得場次座位表錯誤(其它)!",
            });
        };
    }

    // ———————————————————————  檢查座位是否有被鎖住  ———————————————————————
    seatCheckLock = async (req, res: Response, next: NextFunction) => {
        try {
            const seats = await Seat.find({ scheduleId: req.body.scheduleId });
            if (!seats) {
                return next(ErrorService.appError(404, "沒有這筆場次資料！", next));
            };
            const reqSeats = req.body.seats;
            const seatFail = [] // 用來存取無法被選擇的座位
            const seatSuccess = [] // 用來存取成功可選取的位置
            reqSeats.forEach(reqSeatsItem => {
                seats.forEach(async seatsItem => {
                    if (reqSeatsItem === seatsItem.seatName) {
                        if (seatsItem.status !== 0) {
                            seatFail.push(seatsItem.seatName)
                        } else {
                            seatSuccess.push({
                                seatId: seatsItem.id,
                                seatName: seatsItem.seatName
                            })
                        }
                    }

                });
            });
            if(seatFail.length === 0 && seatSuccess.length === 0){
                return next(ErrorService.appError(404, "資料錯誤", next));
            }
            // 若有位置無法選擇則回傳錯誤訊息
            if (seatFail.length > 0) {
                res.status(200).json({
                    code: -1,
                    message: `${seatFail} 無法選取請重新選擇座位`,
                });
                return;
            }

            // 若都可以選擇則將選定得位置鎖住
            await Seat.updateMany(
                {  scheduleId: { $eq: req.body.scheduleId } ,seatName: { $in: reqSeats } },
                { $set: { status: 2 } }
            )
            // 回傳成功選取得座位
            res.status(200).json({
                code: 1,
                message: "成功鎖定座位!",
                data: seatSuccess
            });
        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "檢查座位是否有被鎖住錯誤(其它)!",
            });
        };
    }

    // ———————————————————————  更新座位狀態  ———————————————————————
    updateSeatStatus = async (req, res: Response, next: NextFunction) => {
        try {
            const reqArr = req.body;
            for (let i = 0; i < reqArr.length; i++) {
                await Seat.findByIdAndUpdate(reqArr[i].id,{
                    "status": reqArr[i].status
                })
            }
            const resData = req.body;
            res.status(200).json({
                code: 1,
                message: "成功修改座位狀態!",
            });
        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "更新座位狀態錯誤(其它)!",
            });
        };
    }

}



export default new SeatController();