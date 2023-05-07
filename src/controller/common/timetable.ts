import Timetable from '../../models/timetable.model';
// import Theater from '../../models/theater.model';
// import Movie from '../../models/movie.model';
import ErrorService from './../../service/error';
import { NextFunction } from "express";

class TimetableController {
    constructor() {

    }

    /** 取得時刻表 */
    getList = async (req, res, next: NextFunction) => {
        console.log("get timetable list");
        const startDate = req.query.startDate; // timestamp
        const endDate = req.query.endDate; // timestamp


        // 驗證欄位
        if (!startDate || !endDate) {
            return next(ErrorService.appError(400, "缺少必要欄位", next));
        };

        try {
            const timetable = await Timetable.find(
                { startDate, endDate },        // 條件
            )
                .populate('movie')
                .populate('theater')
                .sort('startDate') //照時間排序
                .exec();
            console.log('timetable ', timetable);
            res.status(200).json({
                code: 1,
                message: "成功",
                data: {
                    timetable
                }
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        };
    }

    /** 更新時刻表 */
    create = async (req, res, next) => {
        // console.log("create timetable entry");
        // const { showtime, movieId, theaterId } = req.body;


        // try {
        //   const movie = await Movie.findById(movieId);
        //   const theater = await Theater.findById(theaterId);

        //   if (!movie || !theater) {
        //     return next(ErrorService.appError(404, "查無電影或影院！", next));
        //   }

        //   const timetable = new Timetable({
        //     showtime: new Date(showtime),
        //     movie: movieId,
        //     theater: theaterId,
        //   });

        //   await timetable.save();
        //   res.status(200).json({
        //     code: 1,
        //     message: "成功",
        //     data: {
        //       timetable,
        //     },
        //   });
        // } catch (err) {
        // res.status(400).json({
        //     status: "false",
        //     message: "欄位沒有正確，或是沒有此ID",
        //     error: error
        // });
        // console.log(error);
        //   res.status(500).json({ error: err.message });
        // }
    };

    /** 更新時刻表 */
    update = async (req, res, next: NextFunction) => {
        // console.log("update all timetable entries");
        // const timetables = req.body.timetables;

        // // 驗證欄位
        // if (!timetables || !Array.isArray(timetables)) {
        //     return next(ErrorService.appError(400, "缺少必要欄位或格式不正確", next));
        // }

        // try {
        //     const updatedTimetables = await Promise.all(
        //         timetables.map(async (item) => {
        //             const { _id, showtime, movieId, theaterId } = item;
        //             const updatedTimetable = await Timetable.findByIdAndUpdate(
        //                 _id,
        //                 { showtime: new Date(showtime), movie: movieId, theater: theaterId },
        //                 { new: true }
        //             );
        //             return updatedTimetable;
        //         })
        //     );

        //     res.status(200).json({
        //         code: 1,
        //         message: "成功",
        //         data: {
        //             updatedTimetables,
        //         },
        //     });
        // } catch (err) {
        //     res.status(500).json({ error: err.message });
        // }
    }

    delete =async (req, res, next: NextFunction) => {
        console.log("delete timetable entry");
        const timetableId = req.params.timetableId;
      
        // 驗證欄位
        if (!timetableId) {
          return next(ErrorService.appError(400, "缺少必要欄位", next));
        }
      
        try {
          const deletedTimetable = await Timetable.findByIdAndDelete(timetableId);
      
          if (!deletedTimetable) {
            return next(ErrorService.appError(404, "找不到指定的時刻表條目", next));
          }
      
          res.status(200).json({
            code: 1,
            message: "時刻表條目已成功刪除！",
            data: {
              deletedTimetable,
            },
          });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
    }
}



export default new TimetableController();