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
class MovieController {
    constructor() {
        this.getInfo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let movieId = req.params.id;
            console.log('movieId', movieId);
            const movie = yield moviesModels_1.default.findOne({ id: movieId });
            console.log('movie', movie);
            if (!movie) {
                return next(error_1.default.appError(404, "沒有這筆電影資料！", next));
            }
            ;
            try {
                res.status(200).json({
                    code: 1,
                    message: "成功取得電影資料!",
                    data: movie
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
    }
}
exports.default = new MovieController();
