import { Response, NextFunction } from 'express';
import Seat from '../../models/common/seatsModels';
import ErrorService from './../../service/error';

class SeatCheckLockController {
    constructor() {

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
                    if(reqSeatsItem === seatsItem.seatName){
                        if(seatsItem.status!==0){
                            seatFail.push(seatsItem.seatName)
                        }
                    }
                    
                });
            });
            // 若有位置無法選擇則回傳錯誤訊息
            if(seatFail.length > 0){
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



export default new SeatCheckLockController();