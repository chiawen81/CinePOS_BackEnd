import Theater from '../../models/common/theater.model';
import Option from '../../models/common/optionsModels';
import ErrorService from './../../service/error';

class TheaterController {
    constructor() {
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
                // swap if to < from
                if(queryParm.capacityTo < queryParm.capacityFrom){
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
