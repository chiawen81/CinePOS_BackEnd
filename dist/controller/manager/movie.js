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
const moviesModels_1 = __importDefault(require("../../models/manager/moviesModels"));
const error_1 = __importDefault(require("./../../service/error"));
const optionsModels_1 = __importDefault(require("../../models/common/optionsModels"));
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
            try {
                const movieData = req.body;
                console.log('movieData', movieData);
                const movie = new moviesModels_1.default(movieData);
                const validationError = movie.validateSync();
                if (validationError) {
                    const errorMessage = Object.values(validationError.errors).map(err => err.message).join('\n');
                    return res.status(422).json({
                        code: -1,
                        message: errorMessage || "新增電影資料錯誤(其它)!",
                    });
                }
                ;
                const savedMovie = yield movie.save();
                res.status(201).json({
                    code: 1,
                    message: '電影資料新增成功！',
                    data: savedMovie,
                });
            }
            catch (error) {
                res.status(500).json({
                    code: -1,
                    message: '電影資料新增失敗！'
                });
            }
            ;
        });
        this.updateInfo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const movieId = req.body.id;
                const movieData = req.body;
                console.log('movieId', movieId, 'movieData', movieData);
                const movie = yield moviesModels_1.default.findById(movieId);
                const validationError = movie.validateSync();
                if (validationError) {
                    const errorMessage = Object.values(validationError.errors).map(err => err.message).join('\n');
                    return res.status(422).json({
                        code: -1,
                        message: errorMessage || '更新電影資料錯誤！',
                    });
                }
                ;
                const updatedMovie = yield moviesModels_1.default.findOneAndUpdate({ id: movieId }, { name: movieData }, { new: true });
                if (!updatedMovie) {
                    return res.status(401).json({
                        code: -1,
                        message: '找不到此電影資料！',
                    });
                }
                else {
                    res.status(200).json({
                        code: 1,
                        message: '電影資料更新成功！',
                        data: updatedMovie,
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
                let condition = {};
                if (queryData.title) {
                    condition["title"] = queryData.title;
                }
                ;
                if (queryData.searchDateS && queryData.searchDateE) {
                    condition["releaseDate"] = {
                        $gte: queryData.searchDateS,
                        $lte: queryData.searchDateE
                    };
                }
                ;
                if (queryData.status) {
                    condition["status"] = queryData.status;
                }
                ;
                console.log('condition', condition);
                let movieData = yield moviesModels_1.default.find(condition !== null && condition !== void 0 ? condition : {});
                let resMsg = movieData.length ? "成功查詢資料！" : "沒有符合條件的資料！";
                let listData = this.getlistData(movieData);
                console.log('movieData', movieData, 'listData', listData);
                res.status(200).json({
                    code: 1,
                    message: resMsg,
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
    }
    getlistData(movieData) {
        let listData = [];
        if (movieData.length) {
            movieData.forEach((movie) => {
                let obj = {
                    _id: movie._id,
                    status: movie.status,
                    title: movie.title,
                    genreName: [],
                    rateName: "",
                    releaseDate: movie.releaseDate,
                    provideVersionName: [],
                };
                listData.push(obj);
            });
        }
        ;
        return listData;
    }
    getListQuery(data) {
        console.log('data', data);
        let condition = {
            title: data.title,
            searchDateS: data.searchDateS,
            searchDateE: data.searchDateE,
            status: data.status ? Number(data.status) : null
        };
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
}
exports.default = new MovieController();
