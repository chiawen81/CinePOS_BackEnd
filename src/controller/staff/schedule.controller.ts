import { Response, NextFunction } from 'express';
import Timetable from '../../models/common/timetable.model';
import Seat from '../../models/common/seats.model';
import ErrorService from '../../service/error';
// // import movies from '../../models/manager/moviesModels'

interface ScheduleItem {
    scheduleId: string;
    time: Date;
    theater: string;
    theaterType: string;
    totalCapacity: number;
    remainSeats?: number;
}

interface ResData {
    movieId: string;
    title: string;
    posterUrl: string;
    rate: number;
    runtime: number;
    scheduleList: ScheduleItem[];
}

class ScheduleController {
    constructor() {

    }

    // ———————————————————————  場次查詢 ———————————————————————
    getScheduleList = async (req, res: Response, next: NextFunction) => {
        try {
            const startDate: number = Number(req.query.startDate); // timestamp
            const endDate: number = Number(req.query.endDate); // timestamp
            const schedule = await Timetable.find(
                { 
                    startDate: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                }
                )
                .populate({
                    path: 'movieId',
                    select: 'title title enTitle runtime rate posterUrl'
                })
                .populate({
                    path: 'theaterId',
                    select: 'name type totalCapacity'
                })
            if(!schedule){return next(ErrorService.appError(404, "沒有這筆場次資料！", next))}
            let resData:ResData[] = [];
            
            schedule.forEach(scheduleItem => {
                const findResData = resData.find(element => element.movieId === String(scheduleItem.movieId['id']));
                if (!!findResData) {
                    findResData.scheduleList.push(this.scheduleListData(scheduleItem));
                } else {
                    const scheduleList = [
                        this.scheduleListData(scheduleItem)
                    ]
                    resData.push({
                        movieId: String(scheduleItem.movieId['id']),
                        title: scheduleItem.movieId['title'],
                        posterUrl: scheduleItem.movieId['posterUrl'],
                        runtime: scheduleItem.movieId['runtime'],
                        rate: scheduleItem.movieId['rate'],
                        scheduleList: scheduleList
                    })
                }
            });

            for (let i = 0; i < resData.length; i++) {
                for (let j = 0; j < resData[i].scheduleList.length; j++) {
                    const seats = await Seat.find({ scheduleId: resData[i].scheduleList[j].scheduleId, status: { $ne: 0 } });
                    const seatsSold = seats.filter(item => item.status === 1);
                    resData[i].scheduleList[j].remainSeats = resData[i].scheduleList[j].totalCapacity - seatsSold.length;
                }
            }

            res.status(200).json({
                code: 1,
                message: "成功取得場次",
                data: resData
            });
        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "取得場次錯誤(其它)!",
            });
        };
    }

    scheduleListData(scheduleItem): ScheduleItem {
        return {
            scheduleId: scheduleItem.id,
            time: scheduleItem.startDate,
            theater: scheduleItem.theaterId.name,
            theaterType: scheduleItem.theaterId.type,
            totalCapacity: scheduleItem.theaterId.totalCapacity
        }
    }

}



export default new ScheduleController();