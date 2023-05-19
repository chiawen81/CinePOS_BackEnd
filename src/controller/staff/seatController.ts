import { Response, NextFunction } from 'express';
import Seat from '../../models/common/seatsModels';
import ErrorService from '../../service/error';
import Timetable from '../../models/common/timetable.model';
import Theater from '../../models/common/theater.model';

interface seat {
    id: string;
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
            console.log(Theater);
            const scheduleTheaters = await Timetable
                .findByIdAndUpdate(req.params.scheduleId)
                .populate({
                    path: 'theaterId',
                    select: 'name totalCapacity row col rowLabel seatMap'
                })
            if(!scheduleTheaters.theaterId){
                return next(ErrorService.appError(404, "沒有這筆場次座位資料！", next));
            }
            const seatMap = scheduleTheaters.theaterId.seatMap;
            const seats =  await Seat.find({ scheduleId: req.params.scheduleId ,status: {$ne:0}});
            if(!seats){
                return next(ErrorService.appError(404, "座位資料錯誤！", next));
            }
            const seatsSold = seats.filter(item => item.status === 1);
            let list: list[] = [];
            scheduleTheaters.theaterId.rowLabel.forEach((row, rowIndex) => {
                let seat: seat[] = [];
                let j = 0;
                if (!!row) {
                    for (let i = scheduleTheaters.theaterId.col * rowIndex; i <= (scheduleTheaters.theaterId.col * (rowIndex + 1)) - 1; i++) {
                        j++;
                        seat.push({
                            id: String(j),
                            status: 0,
                            type: seatMap[i]
                        })
                    }
                    list.push({
                        rows: row,
                        seat: seat
                    })
                }else{
                    list.push({
                        rows: 'none'
                    })
                }
            });
            seats.forEach(seatsItem => {
                list.forEach(listItem => {
                    if(listItem.rows === seatsItem.seatRow){
                        listItem.seat[Number(seatsItem.seatCol)-1].status =  seatsItem.status
                    }
                    
                });
            });
            const resData = {
                sold: seatsSold.length,
                free: scheduleTheaters.theaterId.totalCapacity - seatsSold.length,
                maxRows: scheduleTheaters.theaterId.row,
                maxColumns: scheduleTheaters.theaterId.col,
                list: list
            }
            res.status(200).json({
                code: 1,
                message: "OK",
                data: resData
            });
            return;
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
            reqSeats.forEach(reqSeatsItem => {
                seats.forEach(async seatsItem => {
                    if (reqSeatsItem === seatsItem.seatName) {
                        if (seatsItem.status !== 0) {
                            seatFail.push(seatsItem.seatName)
                        }
                    }

                });
            });
            // 若有位置無法選擇則回傳錯誤訊息
            if (seatFail.length > 0) {
                return next(ErrorService.appError(400, `${seatFail} 無法選取請重新選擇座位`, next));
            }
            // 若都可以選擇則將選定得位置鎖住
            await Seat.updateMany(
                { seatName: { $in: reqSeats } },
                { $set: { status: 2 } }
            )
            // 回傳成功選取得座位
            res.status(200).json({
                code: 1,
                message: "成功鎖定座位!",
                data: reqSeats
            });
        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "檢查座位是否有被鎖住錯誤(其它)!",
            });
        };
    }
}



export default new SeatController();