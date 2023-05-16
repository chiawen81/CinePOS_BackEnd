import { Request, Response, NextFunction } from 'express';
import Movie from '../../models/manager/moviesModels';
import ErrorService from './../../service/error';
import Option from '../../models/common/optionsModels';

class MovieController {
    constructor() {

    }





    // ———————————————————————  取得資料  ———————————————————————
    getInfo = async (req, res: Response, next: NextFunction) => {
        let movieId = req.params.id;
        console.log('movieId', movieId);
        const movieData = await Movie.findOne({ id: movieId });
        console.log('movie', movieData);

        if (!movieData) {
            return next(ErrorService.appError(404, "沒有這筆電影資料！", next));
        };

        try {
            movieData.genreName = (await this.getMultiOptionName(1, (movieData.genre as any), next)) as string[];
            movieData.provideVersionName = (await this.getMultiOptionName(2, (movieData.provideVersion as any), next) as string[]);
            movieData.rateName = await this.getSingleOptionName(3, (movieData.rate as any), next);
            movieData.statusName = await this.getSingleOptionName(4, (movieData.status as any), next);
        } catch (err) {
            return next(ErrorService.appError(422, "查詢選項代碼過程發生錯誤！", next));
        };

        try {
            res.status(200).json({
                code: 1,
                message: "成功取得電影資料!",
                data: movieData
            });
        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "取得電影資料錯誤(其它)!",
            });
        };
    }



    // 取得單一選項名字
    getSingleOptionName = async (typeId: number, value: number, next: NextFunction) => {
        try {
            const optionData = await Option.findOne({ typeId, value });
            if (optionData) {
                return optionData.name;
            } else {
                return next(ErrorService.appError(401, "請輸入要查詢的選項欄位代碼！", next));
            };
        } catch (err) {
            return next(ErrorService.appError(422, "查詢選項代碼過程發生錯誤！", next));
        };
    };



    // 取得多個選項名字
    getMultiOptionName = async (typeId: number, values: number[], next: NextFunction) => {
        try {
            const optionData = await Option.find({ typeId, value: { $in: values } });
            const optionNames = optionData.map((option) => option.name);
            console.log('optionNames', optionNames);
            return optionNames;
        } catch (err) {
            return next(ErrorService.appError(422, "查詢選項代碼過程發生錯誤！", next));
        }
    };





    // ———————————————————————  新增資料  ———————————————————————
    createInfo = async (req: Request<{}, {}, any>, res: Response, next: NextFunction) => {
        try {
            // 從請求中取得新增的電影資料
            const movieData = req.body;
            console.log('movieData', movieData);

            // 建立新的電影資料
            const movie = new Movie(movieData);

            // 驗證資料格式
            const validationError = movie.validateSync();
            if (validationError) {
                const errorMessage = Object.values(validationError.errors).map(err => err.message).join('\n');
                return res.status(422).json({
                    code: -1,
                    message: errorMessage || "新增電影資料錯誤(其它)!",
                });
            };

            // 儲存電影資料到資料庫
            const savedMovie = await movie.save();

            res.status(201).json({
                code: 1,
                message: '電影資料新增成功！',
                data: savedMovie,
            });

        } catch (error) {
            res.status(500).json({
                code: -1,
                message: '電影資料新增失敗！'
            });
        };
    }





    // ———————————————————————  更新資料  ———————————————————————
    updateInfo = async (req: Request<{}, {}, any>, res: Response, next: NextFunction) => {
        try {
            const movieId = req.body.id;
            const movieData = req.body;
            console.log('movieId', movieId, 'movieData', movieData);

            // 驗證資料格式
            const movie = await Movie.findById(movieId);
            const validationError = movie.validateSync();
            if (validationError) {
                const errorMessage = Object.values(validationError.errors).map(err => err.message).join('\n');
                return res.status(422).json({
                    code: -1,
                    message: errorMessage || '更新電影資料錯誤！',
                });
            };

            // 檢查電影資料是否存在
            const updatedMovie = await Movie.findOneAndUpdate(
                { id: movieId },        // 比對條件
                { name: movieData },    // 更新的內容
                { new: true }
            );

            if (!updatedMovie) {
                return res.status(401).json({
                    code: -1,
                    message: '找不到此電影資料！',
                });

            } else {
                res.status(200).json({
                    code: 1,
                    message: '電影資料更新成功！',
                    data: updatedMovie,
                });
            };

        } catch (error) {
            res.status(500).json({
                code: -1,
                message: '電影資料更新失敗(其它)！',
            });
        };
    }





}



export default new MovieController();