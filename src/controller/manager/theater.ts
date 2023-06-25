import Theater from '../../models/theater.model';
import Timetable from '../../models/timetable.model';
import Option from '../../models/optionsModels';
import Seats from '../../models/seats.model';
import ErrorService from './../../service/error';

class TheaterController {
    constructor() {
    }

    // ———————————————————————  查詢影廳使用狀況  ———————————————————————
    getTheaterUsage = async (req, res) => {
        const theaterId = req.params.theaterId;
    
        try {
            const timetable = await Timetable.find(
              {
                theaterId: theaterId,
                startDate: {
                  $gte: new Date(),
                }
              } 
            )

            res.status(200).json({
                code: 1,
                message: "成功取得影廳使用狀況資料！",
                data: {
                    inUse : timetable.length > 0 ? true : false
                }
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        };
    }

    // ———————————————————————  查詢影廳列表  ———————————————————————
    getTheaterList = async (req, res) => {
        try {
            // 取得前端參數
            let queryParm = {
                name: req.query.name,
                floor: req.query.floor,
                type: req.query.type ? req.query.type.split(',') : undefined,
                capacityFrom: req.query.capacityFrom,
                capacityTo: req.query.capacityTo,
                withDisabled:  req.query.withDisabled ? Number(req.query.withDisabled) : undefined,
                status: req.query.status ? Number(req.query.status) : undefined
            };
            
            // 驗證前端參數
            let errMsg = this.getListQueryValidatorErrMsg(queryParm);
            if (errMsg) {
                return res.status(400).json({
                    code: -1,
                    message: errMsg
                });
            };

            // 查詢條件們
            let condition = {};
            if (queryParm.name) {
                condition["name"] = { $regex: queryParm.name };
            };
            if (queryParm.floor) {
                condition["floor"] = queryParm.floor;
            };
            if (queryParm.type) {
                condition["type"] = { $in: queryParm.type };
            };
            if (queryParm.capacityFrom && queryParm.capacityTo) {
                // swap if to > from
                if(queryParm.capacityTo > queryParm.capacityFrom){
                    let temp = queryParm.capacityFrom;
                    queryParm.capacityFrom = queryParm.capacityTo;
                    queryParm.capacityTo = temp;
                }
                condition["totalCapacity"] = {
                    $gte: queryParm.capacityFrom,
                    $lte: queryParm.capacityTo
                };
            } else {
                if (queryParm.capacityFrom) {
                    condition["totalCapacity"] = {
                        $gte: queryParm.capacityFrom
                    };
                };
                if (queryParm.capacityTo) {
                    condition["totalCapacity"] = {
                        $lte: queryParm.capacityTo
                    };
                };
            };
            
            if (typeof queryParm.withDisabled !== 'undefined') {
                if(queryParm.withDisabled === 0){
                    condition["wheelChairCapacity"] = 0;
                }else{
                    condition["wheelChairCapacity"] = {
                        $gte: queryParm.withDisabled
                    };
                }
            };
            if (typeof queryParm.status !== 'undefined') {
                condition["status"] = queryParm.status;
            };

            // 取得影廳列表資料
            let theaterData = await Theater.find(condition ?? {}).sort({ name: 1 });
            let theaterType = await Option.find({ typeId: 2 });
            
            let listData = [];
            if (theaterData.length) {
                theaterData.forEach((theater) => {
                    let item = {
                        _id: theater.id,
                        status: theater.status,
                        floor: theater.floor,
                        name: theater.name,
                        type: (theaterType.find(val => val.value === theater.type)).name,
                        totalCapacity: theater.totalCapacity,
                        wheelChairCapacity: theater.wheelChairCapacity
                    };
                    listData.push(item);
                });
            };

            res.status(200).json({
                code: 1,
                message: theaterData.length ? "成功查詢資料！" : "沒有符合條件的資料！",
                data: listData
            });

        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || '取得影廳列表資訊失敗！',
            });
        };
    }

    // 列表-取得驗證錯誤的訊息
    getListQueryValidatorErrMsg(data): string {
        let errMsg: string = "";

        // 席次型別檢查
        if (typeof data.capacityFrom !== 'undefined') {
            if (isNaN(Number(data.capacityFrom))) {
                errMsg = "席次須為數字！";
            };
        }
        if (typeof data.capacityTo !== 'undefined') {
            if (isNaN(Number(data.capacityTo))) {
                errMsg = "席次須為數字！";
            };
        }

        // 發佈狀態驗證
        if (typeof data.status !== 'undefined') {
            if (isNaN(Number(data.status))) {
                errMsg = "請輸入正確的發佈狀態！";
            } else {
                if ((data.status !== 0) && (data.status !== 1)) {
                    errMsg = "請輸入正確的發佈狀態！";
                };
            };
        }

        // 是否有殘障座位驗證
        if (typeof data.withDisabled !== 'undefined') {
            if (isNaN(Number(data.withDisabled))) {
                errMsg = "請輸入正確的殘障座位！";
            } else {
                if ((data.withDisabled !== 0) && (data.withDisabled !== 1)) {
                    errMsg = "請輸入正確的殘障座位！";
                };
            };
        }

        return errMsg;
    }

    // ———————————————————————  新增影廳  ———————————————————————
    createTheater = async (req: { body: TheaterCreateRequest }, res, next) => {
        
        const request: TheaterCreateRequest = req.body;

        // 驗證欄位
        if (!request) {
            return next(ErrorService.appError(400, "缺少必要欄位或格式不正確", next));
        }

        try {
            const theater = await Theater.create(request);
            await theater.save();
            res.status(200).json({
                code: 1,
                message: "成功",
                data: {
                    theater,
                },
            });
        } catch (err) {
            res.status(500).json({ code: -1, error: err.message });
        }
    }

    // ———————————————————————  編輯影廳  ———————————————————————
    updateTheater = async (req: { params: string, body: TheaterCreateRequest }, res, next) => {
        
        let theaterId = req.params["theaterId"];
        const request: TheaterCreateRequest = req.body;

        // 驗證欄位
        if (!request) {
            return next(ErrorService.appError(400, "缺少必要欄位或格式不正確", next));
        }

        try {
            // 檢查影廳是否存在
            const updatedTheater = await Theater.findOneAndUpdate(
                { _id: theaterId },    // 比對條件
                {  
                    name: request.name,
                    type: request.type,
                    floor: request.floor,
                    totalCapacity: request.totalCapacity,
                    wheelChairCapacity: request.wheelChairCapacity,
                    row: request.row,
                    col: request.col,
                    rowLabel: request.rowLabel,
                    colLabel: request.colLabel,
                    seatMap: request.seatMap,
                    updatedAt: new Date()
                },    // 更新的內容
                { new: true }
            );

            if (!updatedTheater) {
                return res.status(401).json({
                    code: -1,
                    message: '找不到此影廳！',
                });

            } else {
                res.status(200).json({
                    code: 1,
                    message: '影廳更新成功！',
                    data: updatedTheater,
                });
            };
        } catch (err) {
            res.status(500).json({ code: -1, error: err.message });
        }
    }

    // ———————————————————————  查詢影廳  ———————————————————————
    getTheater = async (req, res, next) => {
        const theaterId = req.params.theaterId;
    
        // 驗證欄位
        if (!theaterId) {
          return next(ErrorService.appError(400, "缺少必要欄位", next));
        }
    
        try {
          const theater = await Theater.findOne({ _id: theaterId });
    
          if (!theater) {
            return next(ErrorService.appError(404, "找不到影廳", next));
          }
    
          res.status(200).json({
            code: 1,
            message: "成功取得影廳資料！",
            data: theater
          });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
    }

    // ———————————————————————  刪除影廳  ———————————————————————
    deleteTheater = async (req, res, next) => {
        const theaterId = req.params.theaterId;
    
        // 驗證欄位
        if (!theaterId) {
          return next(ErrorService.appError(400, "缺少必要欄位", next));
        }
    
        try {
          const deletedTheater = await Theater.findByIdAndDelete(theaterId);
    
          if (!deletedTheater) {
            return next(ErrorService.appError(404, "找不到影廳", next));
          }
    
          res.status(200).json({
            code: 1,
            message: "影廳已成功刪除！"
          });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
    }

    // ———————————————————————  上/下架影廳  ———————————————————————
    updateTheaterStatus = async (req: { params: string, body: TheaterStatusRequest }, res, next) => {
        
        let theaterId = req.params["theaterId"];
        const request: TheaterStatusRequest = req.body;

        // 驗證欄位
        if (!request) {
            return next(ErrorService.appError(400, "缺少必要欄位或格式不正確", next));
        }

        // 驗證前端參數
        let errMsg: string = "";
        let statusCheck = request.status ? Number(request.status) : undefined

        if (typeof statusCheck !== 'undefined') {
            if (isNaN(Number(statusCheck))) {
                errMsg = "請輸入正確的發佈狀態！";
            } else {
                if ((statusCheck !== 0) && (statusCheck !== 1)) {
                    errMsg = "請輸入正確的發佈狀態！";
                };
            };
        }
        if (errMsg) {
            return res.status(400).json({
                code: -1,
                message: errMsg
            });
        };

        try {
            // 檢查影廳是否存在
            const updatedTheater = await Theater.findOneAndUpdate(
                { _id: theaterId },    // 比對條件
                {  
                    status: request.status,
                    updatedAt: new Date()
                },    // 更新的內容
                { new: true }
            );

            if (!updatedTheater) {
                return res.status(401).json({
                    code: -1,
                    message: '找不到此影廳！',
                });

            } else {
                res.status(200).json({
                    code: 1,
                    message: '影廳狀態更新成功！',
                    data: updatedTheater,
                });
            };
        } catch (err) {
            res.status(500).json({ code: -1, error: err.message });
        }
    }

    // create seats seeder
    insertSeat = async (req: { body: TheaterCreateSeats }, res, next) => {
        
        const request: TheaterCreateSeats = req.body;

        // 驗證欄位
        if (!request) {
            return next(ErrorService.appError(400, "缺少必要欄位或格式不正確", next));
        }

        try {
            let theaterData = await Theater.findOne({_id: request.theaterId});
            if (theaterData) {
                let seatRow = this.splitArrayIntoChunks(theaterData.seatMap, theaterData.row);
                
                var dataArray = [];
                for (let i = 0; i < seatRow.length; i++) {
                    let colCount = 0;
                    seatRow[i].forEach(element => {
                        if(element == "0" || element == "1"){
                            // 0: 普通, 1:殘障
                            const seat = {
                                scheduleId: request.scheduleId,
                                seatRow: theaterData.rowLabel[i],
                                seatCol: theaterData.colLabel[colCount],
                                seatName: theaterData.rowLabel[i] + theaterData.colLabel[colCount] + "",
                                status: Math.floor(3 * Math.random())
                            };
                            console.log("a:" + element);
                            console.log("colCount:" + element);
                            dataArray.push(seat);

                        }else if(element === "-1"){
                            //不開放
                            const seat = {
                                scheduleId: request.scheduleId,
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
                message: "成功"
            });
        } catch (err) {
            res.status(500).json({ code: -1, error: err.message });
        }
    }

    splitArrayIntoChunks<T>(array: T[], chunks: number): T[][] {
        const result: T[][] = [];
      
        if (chunks <= 0) {
          throw new Error("Chunks should be a positive number.");
        }
      
        const chunkSize = Math.ceil(array.length / chunks);
      
        for (let i = 0; i < array.length; i += chunkSize) {
          result.push(array.slice(i, i + chunkSize));
        }
      
        return result;
    }
}

export default new TheaterController();

export interface TheaterCreateRequest {
    name: string,
    type: number,
    floor: number,
    totalCapacity: number,
    wheelChairCapacity: number,
    row: number,
    col: number,
    rowLabel: Array<string>,
    colLabel: Array<string>,
    seatMap: Array<string>
}

export interface TheaterStatusRequest {
    status: number
}

export interface TheaterCreateSeats {
    scheduleId: string,
    theaterId: string
}
