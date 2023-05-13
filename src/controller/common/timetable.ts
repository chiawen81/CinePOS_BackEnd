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
        // { startDate, endDate },        // 條件
      )
        // .populate(
        //   {
        //     path: 'movie',
        //     select: '_id title rate runtime'
        //   }
        // )
        // .populate({
        //   path: 'theater',
        //   select: '_id'
        // })
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
    console.log("create timetable entry");
    const request = req.body;
    console.log(request);

    // 驗證欄位
    if (!request) {
      return next(ErrorService.appError(400, "缺少必要欄位或格式不正確", next));
    }
    
    try {      const timetable = await Timetable.create(request);
      // await timetable.save();
      res.status(200).json({
        code: 1,
        message: "成功",
        data: {
          timetable,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  /** 更新時刻表 */
  update = async (req, res, next: NextFunction) => {
    console.log("update all timetable entries");
    const timetable = req.body;
    const id = timetable._id;
    // update 的日期範圍
    // const startDate = req.body.startDate;
    // update 的日期範圍
    // const endDate = req.body.endDate;
    console.log(timetable);

    // 驗證欄位
    if (!timetable) {
      return next(ErrorService.appError(400, "缺少必要欄位或格式不正確", next));
    }

    try {
  
          const updatedTimetable = await Timetable.findByIdAndUpdate(
            id,timetable,
            { new: true}
          );



      res.status(200).json({
        code: 1,
        message: "成功",
        data: {
          timetable:updatedTimetable,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  delete = async (req, res, next: NextFunction) => {
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