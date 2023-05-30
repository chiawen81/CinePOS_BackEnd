"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const theater_model_1 = __importDefault(require("../../models/common/theater.model"));
const optionsModels_1 = __importDefault(require("../../models/common/optionsModels"));
const seats_model_1 = __importDefault(require("../../models/common/seats.model"));
const error_1 = __importDefault(require("./../../service/error"));
class TheaterController {
    constructor() {
        this.getTheaterList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let queryParm = {
                    name: req.query.name,
                    floor: req.query.floor,
                    type: req.query.type ? req.query.type.split(',') : undefined,
                    capacityFrom: req.query.capacityFrom,
                    capacityTo: req.query.capacityTo,
                    withDisabled: req.query.withDisabled ? Number(req.query.withDisabled) : undefined,
                    status: req.query.status ? Number(req.query.status) : undefined
                };
                let errMsg = this.getListQueryValidatorErrMsg(queryParm);
                if (errMsg) {
                    return res.status(400).json({
                        code: -1,
                        message: errMsg
                    });
                }
                ;
                let condition = {};
                if (queryParm.name) {
                    condition["name"] = { $regex: queryParm.name };
                }
                ;
                if (queryParm.floor) {
                    condition["floor"] = queryParm.floor;
                }
                ;
                if (queryParm.type) {
                    condition["type"] = { $in: queryParm.type };
                }
                ;
                if (queryParm.capacityFrom && queryParm.capacityTo) {
                    if (queryParm.capacityTo < queryParm.capacityFrom) {
                        let temp = queryParm.capacityFrom;
                        queryParm.capacityFrom = queryParm.capacityTo;
                        queryParm.capacityTo = temp;
                    }
                    condition["totalCapacity"] = {
                        $gte: queryParm.capacityFrom,
                        $lte: queryParm.capacityTo
                    };
                }
                else {
                    if (queryParm.capacityFrom) {
                        condition["totalCapacity"] = {
                            $gte: queryParm.capacityFrom
                        };
                    }
                    ;
                    if (queryParm.capacityTo) {
                        condition["totalCapacity"] = {
                            $lte: queryParm.capacityTo
                        };
                    }
                    ;
                }
                ;
                if (typeof queryParm.withDisabled !== 'undefined') {
                    if (queryParm.withDisabled === 0) {
                        condition["wheelChairCapacity"] = 0;
                    }
                    else {
                        condition["wheelChairCapacity"] = {
                            $gte: queryParm.withDisabled
                        };
                    }
                }
                ;
                if (typeof queryParm.status !== 'undefined') {
                    condition["status"] = queryParm.status;
                }
                ;
                let theaterData = yield theater_model_1.default.find(condition !== null && condition !== void 0 ? condition : {}).sort({ name: 1 });
                let theaterType = yield optionsModels_1.default.find({ typeId: 2 });
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
                }
                ;
                res.status(200).json({
                    code: 1,
                    message: theaterData.length ? "成功查詢資料！" : "沒有符合條件的資料！",
                    data: listData
                });
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || '取得影廳列表資訊失敗！',
                });
            }
            ;
        });
        this.createTheater = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const request = req.body;
            if (!request) {
                return next(error_1.default.appError(400, "缺少必要欄位或格式不正確", next));
            }
            try {
                const theater = yield theater_model_1.default.create(request);
                yield theater.save();
                res.status(200).json({
                    code: 1,
                    message: "成功",
                    data: {
                        theater,
                    },
                });
            }
            catch (err) {
                res.status(500).json({ code: -1, error: err.message });
            }
        });
        this.updateTheater = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let theaterId = req.params["theaterId"];
            const request = req.body;
            if (!request) {
                return next(error_1.default.appError(400, "缺少必要欄位或格式不正確", next));
            }
            try {
                const updatedTheater = yield theater_model_1.default.findOneAndUpdate({ _id: theaterId }, {
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
                }, { new: true });
                if (!updatedTheater) {
                    return res.status(401).json({
                        code: -1,
                        message: '找不到此影廳！',
                    });
                }
                else {
                    res.status(200).json({
                        code: 1,
                        message: '影廳更新成功！',
                        data: updatedTheater,
                    });
                }
                ;
            }
            catch (err) {
                res.status(500).json({ code: -1, error: err.message });
            }
        });
        this.getTheater = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            if (!theaterId) {
                return next(error_1.default.appError(400, "缺少必要欄位", next));
            }
            try {
                const theater = yield theater_model_1.default.findOne({ _id: theaterId });
                if (!theater) {
                    return next(error_1.default.appError(404, "找不到影廳", next));
                }
                res.status(200).json({
                    code: 1,
                    message: "成功取得影廳資料！",
                    data: theater
                });
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
        this.deleteTheater = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            if (!theaterId) {
                return next(error_1.default.appError(400, "缺少必要欄位", next));
            }
            try {
                const deletedTheater = yield theater_model_1.default.findByIdAndDelete(theaterId);
                if (!deletedTheater) {
                    return next(error_1.default.appError(404, "找不到影廳", next));
                }
                res.status(200).json({
                    code: 1,
                    message: "影廳已成功刪除！"
                });
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
        this.updateTheaterStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let theaterId = req.params["theaterId"];
            const request = req.body;
            if (!request) {
                return next(error_1.default.appError(400, "缺少必要欄位或格式不正確", next));
            }
            let errMsg = "";
            let statusCheck = request.status ? Number(request.status) : undefined;
            if (typeof statusCheck !== 'undefined') {
                if (isNaN(Number(statusCheck))) {
                    errMsg = "請輸入正確的發佈狀態！";
                }
                else {
                    if ((statusCheck !== 0) && (statusCheck !== 1)) {
                        errMsg = "請輸入正確的發佈狀態！";
                    }
                    ;
                }
                ;
            }
            if (errMsg) {
                return res.status(400).json({
                    code: -1,
                    message: errMsg
                });
            }
            ;
            try {
                const updatedTheater = yield theater_model_1.default.findOneAndUpdate({ _id: theaterId }, {
                    status: request.status,
                    updatedAt: new Date()
                }, { new: true });
                if (!updatedTheater) {
                    return res.status(401).json({
                        code: -1,
                        message: '找不到此影廳！',
                    });
                }
                else {
                    res.status(200).json({
                        code: 1,
                        message: '影廳狀態更新成功！',
                        data: updatedTheater,
                    });
                }
                ;
            }
            catch (err) {
                res.status(500).json({ code: -1, error: err.message });
            }
        });
        this.insertSeat = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const request = req.body;
            if (!request) {
                return next(error_1.default.appError(400, "缺少必要欄位或格式不正確", next));
            }
            try {
                let theaterData = yield theater_model_1.default.findOne({ _id: request.theaterId });
                if (theaterData) {
                    let seatRow = this.splitArrayIntoChunks(theaterData.seatMap, theaterData.row);
                    var dataArray = [];
                    for (let i = 0; i < seatRow.length; i++) {
                        let colCount = 0;
                        seatRow[i].forEach(element => {
                            if (element == "0" || element == "1") {
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
                            }
                            else if (element === "-1") {
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
                    yield seats_model_1.default.insertMany(dataArray);
                }
                res.status(200).json({
                    code: 1,
                    message: "成功"
                });
            }
            catch (err) {
                res.status(500).json({ code: -1, error: err.message });
            }
        });
    }
    getListQueryValidatorErrMsg(data) {
        let errMsg = "";
        if (typeof data.capacityFrom !== 'undefined') {
            if (isNaN(Number(data.capacityFrom))) {
                errMsg = "席次須為數字！";
            }
            ;
        }
        if (typeof data.capacityTo !== 'undefined') {
            if (isNaN(Number(data.capacityTo))) {
                errMsg = "席次須為數字！";
            }
            ;
        }
        if (typeof data.status !== 'undefined') {
            if (isNaN(Number(data.status))) {
                errMsg = "請輸入正確的發佈狀態！";
            }
            else {
                if ((data.status !== 0) && (data.status !== 1)) {
                    errMsg = "請輸入正確的發佈狀態！";
                }
                ;
            }
            ;
        }
        if (typeof data.withDisabled !== 'undefined') {
            if (isNaN(Number(data.withDisabled))) {
                errMsg = "請輸入正確的殘障座位！";
            }
            else {
                if ((data.withDisabled !== 0) && (data.withDisabled !== 1)) {
                    errMsg = "請輸入正確的殘障座位！";
                }
                ;
            }
            ;
        }
        return errMsg;
    }
    splitArrayIntoChunks(array, chunks) {
        const result = [];
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
exports.default = new TheaterController();
