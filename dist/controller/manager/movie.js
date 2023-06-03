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
const moviesModels_1 = __importDefault(require("../../models/moviesModels"));
const error_1 = __importDefault(require("./../../service/error"));
const optionsModels_1 = __importDefault(require("../../models/optionsModels"));
class MovieController {
    constructor() {
        this.getInfo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let movieId = req.params["id"];
            console.log('movieId', movieId);
            const movieData = yield moviesModels_1.default.findOne({ _id: movieId });
            console.log('movieData', movieData);
            if (!movieData) {
                return next(error_1.default.appError(404, "沒有這筆電影資料！", next));
            }
            ;
            try {
                movieData.genreName = (yield this.getMultiOptionName(1, movieData.genre, next));
                movieData.provideVersionName = (yield this.getMultiOptionName(2, movieData.provideVersion, next));
                movieData.rateName = yield this.getSingleOptionName(3, movieData.rate, next);
                movieData.statusName = yield this.getSingleOptionName(4, movieData.status, next);
            }
            catch (err) {
                return next(error_1.default.appError(422, "查詢選項代碼過程發生錯誤！", next));
            }
            ;
            try {
                res.status(200).json({
                    code: 1,
                    message: "成功取得電影資料!",
                    data: movieData
                });
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || "取得電影資料錯誤(其它)!",
                });
            }
            ;
        });
        this.getSingleOptionName = (typeId, value, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const optionData = yield optionsModels_1.default.findOne({ typeId, value });
                if (optionData) {
                    return optionData.name;
                }
                else {
                    return next(error_1.default.appError(401, "請輸入要查詢的選項欄位代碼！", next));
                }
                ;
            }
            catch (err) {
                return next(error_1.default.appError(422, "查詢選項代碼過程發生錯誤！", next));
            }
            ;
        });
        this.getMultiOptionName = (typeId, values, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const optionData = yield optionsModels_1.default.find({ typeId, value: { $in: values } });
                const optionNames = optionData.map((option) => option.name);
                console.log('optionNames', optionNames);
                return optionNames;
            }
            catch (err) {
                return next(error_1.default.appError(422, "查詢選項代碼過程發生錯誤！", next));
            }
            ;
        });
        this.createInfo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            let isParaValid = this.isMovieParaValid(reqData, false);
            console.log('isParaValid ', isParaValid);
            if (!isParaValid.valid) {
                return next(error_1.default.appError(400, isParaValid.errMsg, next));
            }
            ;
            console.log('通過驗證！');
            try {
                let newMovieData = yield moviesModels_1.default.create(reqData);
                console.log('新增電影資料成功');
                res.status(201).json({
                    code: 1,
                    message: '電影資料新增成功！',
                    data: newMovieData
                });
            }
            catch (err) {
                console.log('error', err);
                return next(error_1.default.appError(500, `電影資料新增失敗！${err.message}`, next));
            }
            ;
        });
        this.updateInfo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            console.log('更新資料- reqData', reqData);
            let isParaValid = this.isMovieParaValid(reqData, true);
            console.log('isParaValid ', isParaValid);
            if (!isParaValid.valid) {
                return next(error_1.default.appError(400, isParaValid.errMsg, next));
            }
            ;
            console.log('通過驗證！');
            try {
                const movieId = req.body._id;
                const movieData = req.body;
                console.log('movieId', movieId, 'movieData', movieData);
                const updatedMovie = yield moviesModels_1.default.findOneAndUpdate({ _id: movieId }, movieData, { new: true });
                if (updatedMovie) {
                    res.status(200).json({
                        code: 1,
                        message: '電影資料更新成功！',
                        data: updatedMovie,
                    });
                }
                else {
                    return res.status(401).json({
                        code: -1,
                        message: '找不到此電影資料！',
                    });
                }
                ;
            }
            catch (error) {
                res.status(500).json({
                    code: -1,
                    message: '電影資料更新失敗(其它)！',
                });
            }
            ;
        });
        this.getList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log('抓到路由- list');
            try {
                let queryData = this.getListQuery(req.query);
                let errMsg = this.getListQueryValidatorErrMsg(queryData);
                if (errMsg) {
                    return res.status(400).json({
                        code: -1,
                        message: errMsg
                    });
                }
                ;
                let condition = this.getListCondition(queryData);
                let movieData = yield moviesModels_1.default.find(condition !== null && condition !== void 0 ? condition : {});
                let optionsData = {
                    genre: yield optionsModels_1.default.find({ typeId: 1 }),
                    provideVersion: yield optionsModels_1.default.find({ typeId: 2 }),
                    rate: yield optionsModels_1.default.find({ typeId: 3 }),
                    status: yield optionsModels_1.default.find({ typeId: 4 }),
                };
                let listData = this.setListData(movieData, optionsData);
                console.log('movieData', movieData, 'listData', listData);
                res.status(200).json({
                    code: 1,
                    message: movieData.length ? "成功查詢資料！" : "沒有符合條件的資料！",
                    data: listData
                });
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || '取得電影列表資訊失敗(其它)！',
                });
            }
            ;
        });
        this.updateReleaseStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let reqData = req.body;
            if (!((typeof reqData.status === 'number') && (typeof reqData.movieId === 'string'))) {
                return next(error_1.default.appError(400, "重送參數資料格式錯誤！", next));
            }
            ;
            try {
                let movieData = yield moviesModels_1.default.findOneAndUpdate({ _id: reqData.movieId }, { status: reqData.status }, { new: true });
                console.log('movieData-更新電影上映狀態', movieData);
                if (movieData) {
                    res.status(200).json({
                        code: 1,
                        message: "更新電影上映狀態成功！",
                        data: movieData
                    });
                }
                else {
                    res.status(422).json({
                        code: -1,
                        message: '查無電影！',
                    });
                }
                ;
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || '更新電影上映狀態失敗(其它)！',
                });
            }
            ;
        });
        this.deleteMovie = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log('抓到路由- delete');
            let movieId = req.params["id"];
            console.log('movieId', movieId);
            if (!movieId) {
                return next(error_1.default.appError(400, "請輸入電影編號！", next));
            }
            ;
            let movieData = moviesModels_1.default.findByIdAndRemove(movieId);
            console.log('movieData', movieData);
            try {
                if (movieData) {
                    res.status(200).json({
                        code: 1,
                        message: "刪除成功！"
                    });
                }
                else {
                    res.status(422).json({
                        code: -1,
                        message: '查無電影！',
                    });
                }
                ;
            }
            catch (err) {
                res.status(500).json({
                    code: -1,
                    message: err.message || '刪除電影失敗(其它)！',
                });
            }
            ;
        });
    }
    isMovieParaValid(reqData, isUpdate) {
        let result = { valid: true, errMsg: "" };
        if (isUpdate && !reqData._id) {
            return result = { valid: false, errMsg: "請輸入電影系統編號！" };
        }
        ;
        if (!reqData.title) {
            return result = { valid: false, errMsg: "請輸入電影名稱！" };
        }
        ;
        if (!reqData.genre.length) {
            return result = { valid: false, errMsg: "請輸入電影類型！" };
        }
        ;
        if (!reqData.runtime) {
            return result = { valid: false, errMsg: "請輸入片長！" };
        }
        ;
        if (!reqData.provideVersion.length) {
            return result = { valid: false, errMsg: "請輸入支援設備！" };
        }
        ;
        if (reqData.rate === null) {
            return result = { valid: false, errMsg: "請輸入電影分級！" };
        }
        ;
        if (reqData.status === null) {
            return result = { valid: false, errMsg: "請輸入上映狀態！" };
        }
        ;
        if (!reqData.releaseDate) {
            return result = { valid: false, errMsg: "請輸入上映日期！" };
        }
        ;
        if (!reqData.posterUrl) {
            return result = { valid: false, errMsg: "請輸入海報連結！" };
        }
        ;
        return result;
    }
    getListQuery(data) {
        console.log('data', data);
        let condition = {
            title: data.title,
            searchDateS: data.searchDateS,
            searchDateE: data.searchDateE,
            status: data.status ? Number(data.status) : null
        };
        console.log('getListQuery', condition);
        return condition;
    }
    getListQueryValidatorErrMsg(data) {
        let errMsg = "";
        if (data.searchDateS > data.searchDateE) {
            errMsg = "查詢迄日不可晚於查詢起日！";
        }
        ;
        if ((data.searchDateS && !data.searchDateS) || (!data.searchDateS && data.searchDateS)) {
            errMsg = "請填寫完整的起訖範圍！";
        }
        ;
        console.log('String(data.status) !== "null"', String(data.status) !== "null", String(data.status));
        if (String(data.status) !== "null") {
            console.log(String(data.status));
            if ((data.status !== -1) && (data.status !== 0) && (data.status !== 1)) {
                errMsg = "請輸入正確的上映狀態！";
            }
            ;
        }
        ;
        return errMsg;
    }
    getListCondition(queryData) {
        console.log('queryData', queryData);
        let condition = {};
        if (queryData.title) {
            condition["title"] = { $regex: `.*${queryData.title}.*`, $options: 'i' };
        }
        ;
        if (queryData.searchDateS && queryData.searchDateE) {
            condition["releaseDate"] = {
                $gte: queryData.searchDateS,
                $lte: queryData.searchDateE
            };
        }
        ;
        if (queryData.status !== null) {
            condition["status"] = queryData.status;
        }
        ;
        console.log('condition- mapping資料庫前', condition);
        return condition;
    }
    setListData(movieData, optionsData) {
        let listData = [];
        console.log('optionsData', optionsData);
        if (movieData.length) {
            movieData.forEach((movie) => {
                let obj = {
                    _id: movie.id,
                    statusName: (optionsData.status.filter(val => val.value === movie.status))[0].name,
                    title: movie.title,
                    genreName: this.getOptionTransListName(movie.genre, optionsData.genre),
                    runtime: movie.runtime,
                    rate: movie.rate,
                    rateName: (optionsData.rate.filter(val => val.value === movie.rate))[0].name,
                    releaseDate: movie.releaseDate,
                    provideVersionName: this.getOptionTransListName(movie.provideVersion, optionsData.provideVersion),
                };
                listData.push(obj);
            });
        }
        ;
        return listData;
    }
    getOptionTransListName(valueList, optionData) {
        let nameList = [];
        valueList.forEach((value) => {
            let name = (optionData.filter((option) => option.value === value)[0]).name;
            nameList.push(name);
        });
        return nameList;
    }
}
exports.default = new MovieController();
