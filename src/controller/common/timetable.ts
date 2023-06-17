import Timetable from '../../models/timetable.model';
import ErrorService from './../../service/error';
import TheaterController from '../manager/theater';
import { NextFunction } from "express";
import Seats from '../../models/seats.model';
import Theater from '../../models/theater.model';
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

  /** 新增時刻表 */
  create = async (req: { body: TimetableCreateRequest }, res, next) => {
    console.log("create timetable entry");
    const request: TimetableCreateRequest = req.body;
    console.log(request);

    // 驗證欄位
    if (!request) {
      return next(ErrorService.appError(400, "缺少必要欄位或格式不正確", next));
    }

    try {
      // 新增時刻表
      const timetable = await Timetable.create(
        {
          movieId: request.movieId,
          theaterId: request.theaterId,
          startDate: new Date(request.startDate),
          endDate: new Date(request.endDate),
        }
      );
      await timetable.save();

      // 新增對應座位
      let theaterData = await Theater.findOne({ _id: request.theaterId });
      if (theaterData) {
        let seatRow = TheaterController.splitArrayIntoChunks(theaterData.seatMap, theaterData.row);

        const dataArray = [];
        for (let i = 0; i < seatRow.length; i++) {
          let colCount = 0;
          seatRow[i].forEach(element => {
            if (element == "0" || element == "1") {
              // 0: 普通, 1:殘障
              const seat = {
                scheduleId: timetable._id,
                seatRow: theaterData.rowLabel[i],
                seatCol: theaterData.colLabel[colCount],
                seatName: theaterData.rowLabel[i] + theaterData.colLabel[colCount] + "",
                status: 0
              };
              dataArray.push(seat);

            } else if (element === "-1") {
              //不開放
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
        await Seats.insertMany(dataArray);
      }


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
    const id = timetable.id;
    const theaterId = timetable.theaterId;


    // 驗證欄位
    if (!timetable) {
      return next(ErrorService.appError(400, "缺少必要欄位或格式不正確", next));
    }

    try {

      const updatedTimetable = await Timetable.findByIdAndUpdate(
        id,
        {
          movieId: timetable.movieId,
          theaterId: timetable.theaterId,
          startDate: new Date(timetable.startDate),
          endDate: new Date(timetable.endDate),
        },
        { new: true }
      );

      // 刪除前次產生座位
      const deletedSeats = await Seats.deleteMany({
        scheduleId: id
      });
      if (!deletedSeats) {
        return next(ErrorService.appError(404, "找不到指定的座位", next));
      }

      // 新增對應座位
      let theaterData = await Theater.findOne({ _id: theaterId });
      if (theaterData) {
        let seatRow = TheaterController.splitArrayIntoChunks(theaterData.seatMap, theaterData.row);

        const dataArray = [];
        for (let i = 0; i < seatRow.length; i++) {
          let colCount = 0;
          seatRow[i].forEach(element => {
            if (element == "0" || element == "1") {
              // 0: 普通, 1:殘障
              const seat = {
                scheduleId: id,
                seatRow: theaterData.rowLabel[i],
                seatCol: theaterData.colLabel[colCount],
                seatName: theaterData.rowLabel[i] + theaterData.colLabel[colCount] + "",
                status: 0
              };
              dataArray.push(seat);

            } else if (element === "-1") {
              //不開放
              const seat = {
                scheduleId: id,
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
        await Seats.insertMany(dataArray);
      }

      console.log('update', updatedTimetable, theaterData);

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
      const deletedSeats = await Seats.deleteMany({
        scheduleId: timetableId
      });

      if (!deletedTimetable) {
        return next(ErrorService.appError(404, "找不到指定的時刻表", next));
      }
      console.log(deletedTimetable, deletedSeats);

      res.status(200).json({
        code: 1,
        message: "時刻表已成功刪除！",
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
  id: string,
  movieId: string,
  theaterId: string,
  startDate: Date,
  endDate: Date
}