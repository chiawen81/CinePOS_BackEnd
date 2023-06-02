import Timetable from '../../models/timetable.model';
import ErrorService from './../../service/error';
import { NextFunction } from "express";

class TimetableController {
  constructor() {

  }

  /** 取得時刻表 */
  getList = async (req, res, next: NextFunction) => {
    console.log("get timetable list");
    const startDate: number = Number(req.query.startDate); // timestamp
    const endDate: number = Number(req.query.endDate); // timestamp


    // 驗證欄位
    if (!startDate && !endDate) {
      try {
        const timetable = await Timetable.find()
          .populate(
            {
              path: 'movieId',
              select: 'title rate runtime'
            }
          )
          .populate({
            path: 'theaterId',
            select: 'name'
          })
        // .sort('startDate') //照時間排序
        // .exec();
        console.log('timetable', timetable);
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
    } else if (startDate && endDate) {
      try {
        const timetable = await Timetable.find(
          {
            startDate: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          }        // 條件
        )
          .populate(
            {
              path: 'movieId',
              select: 'title rate runtime'
            }
          )
          .populate({
            path: 'theaterId',
            select: 'name'
          })
        // .sort('startDate') //照時間排序
        // .exec();
        console.log('timetable', timetable);
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
    else if (!startDate || !endDate) {
      return next(ErrorService.appError(400, "缺少必要欄位", next));
    };


  }

  /** 更新時刻表 */
  create = async (req: { body: TimetableCreateRequest }, res, next) => {
    console.log("create timetable entry");
    const request: TimetableCreateRequest = req.body;
    console.log(request);

    // 驗證欄位
    if (!request) {
      return next(ErrorService.appError(400, "缺少必要欄位或格式不正確", next));
    }

    try {
      const timetable = await Timetable.create(
        {
          movieId: request.movieId,
          theaterId: request.theaterId,
          startDate: new Date(request.startDate),
          endDate: new Date(request.endDate),
        }
      );
      await timetable.save();
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
  update = async (req: { body: TimetableUpdateRequest }, res, next: NextFunction) => {
    console.log("update all timetable entries");
    const timetable = req.body;
    const id = timetable._id;

    console.log(timetable);

    // 驗證欄位
    if (!timetable) {
      return next(ErrorService.appError(400, "缺少必要欄位或格式不正確", next));
    }

    try {

      const updatedTimetable = await Timetable.findByIdAndUpdate(
        id, {
        movieId: timetable.movieId,
        theaterId: timetable.theaterId,
        startDate: new Date(timetable.startDate),
        endDate: new Date(timetable.endDate),
      },
        { new: true }
      );

      res.status(200).json({
        code: 1,
        message: "成功",
        data: {
          timetable: updatedTimetable,
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

export interface TimetableCreateRequest {
  movieId: string,
  theaterId: string,
  startDate: Date,
  endDate: Date
}

export interface TimetableUpdateRequest {
  _id: string,
  movieId: string,
  theaterId: string,
  startDate: Date,
  endDate: Date
}