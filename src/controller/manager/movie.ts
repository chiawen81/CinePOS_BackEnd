import { Request, Response, NextFunction } from 'express';
import Movie from '../../models/manager/moviesModels';
import ErrorService from './../../service/error';
import Option from '../../models/common/optionsModels';
import { MovieDetailGetInfoSuccess } from 'src/interface/swagger-model/movieDetailGetInfoSuccess';
import { MovieDetailCreateParameter } from 'src/interface/swagger-model/movieDetailCreateParameter';
import { MovieDetailCreateSuccess } from 'src/interface/swagger-model/movieDetailCreateSuccess';
import { CommonOptionSuccessDataItem } from 'src/interface/swagger-model/commonOptionSuccessDataItem';



class MovieController {
    constructor() {

    }





    // ———————————————————————  取得資料  ———————————————————————
    getInfo = async (req: Request<{}, MovieDetailGetInfoSuccess, null, string, {}>, res: Response, next: NextFunction) => {
        let movieId = req.params["id"];
        console.log('movieId', movieId);

        const movieData = await Movie.findOne({ _id: movieId });
        console.log('movieData', movieData);

        if (!movieData) {
            return next(ErrorService.appError(404, "沒有這筆電影資料！", next));
        };

        try {
            movieData.genreName = (await this.getMultiOptionName(1, (movieData.genre as number[]), next)) as string[];
            movieData.provideVersionName = (await this.getMultiOptionName(2, (movieData.provideVersion as number[]), next) as string[]);
            movieData.rateName = await this.getSingleOptionName(3, (movieData.rate as number), next);
            movieData.statusName = await this.getSingleOptionName(4, (movieData.status as number), next);
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
        };
    };





    // ———————————————————————  新增資料  ———————————————————————
    createInfo = async (req: Request<{}, MovieDetailCreateSuccess, MovieDetailCreateParameter, null, {}>, res: Response, next: NextFunction) => {
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
    updateInfo = async (req: Request<{}, MovieDetailCreateSuccess, MovieDetailCreateParameter, null, {}>, res: Response, next: NextFunction) => {
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





    // ———————————————————————  查詢電影列表  ———————————————————————
    // 列表- 取得資訊
    getList = async (req: Request<{}, any, any, any, {}>, res: Response, next: NextFunction) => {
        console.log('抓到路由- list');

        try {
            // 驗證前端參數
            let queryData = this.getListQuery(req.query);
            let errMsg = this.getListQueryValidatorErrMsg(queryData);
            if (errMsg) {
                return res.status(400).json({
                    code: -1,
                    message: errMsg
                });
            };

            // 取得電影列表資料
            let condition = this.getListCondition(queryData);
            let movieData = await Movie.find(condition ?? {});
            let optionsData = {
                genre: await Option.find({ typeId: 1 }),
                provideVersion: await Option.find({ typeId: 2 }),
                rate: await Option.find({ typeId: 3 }),
                status: await Option.find({ typeId: 4 }),
            };
            let listData = this.setListData(movieData, optionsData);
            console.log('movieData', movieData, 'listData', listData);

            res.status(200).json({
                code: 1,
                message: movieData.length ? "成功查詢資料！" : "沒有符合條件的資料！",
                data: listData
            });

        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || '取得電影列表資訊失敗(其它)！',
            });
        };
    }



    // 列表- 取得查詢條件
    getListQuery(data: any) {
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



    // 列表- 取得驗證錯誤的訊息
    getListQueryValidatorErrMsg(data: any): string {
        let errMsg: string = "";

        // 日期驗證（比大小）
        if (data.searchDateS > data.searchDateE) {
            errMsg = "查詢迄日不可晚於查詢起日！";
        };

        // 日期驗證（有填則兩者都要填）
        if ((data.searchDateS && !data.searchDateS) || (!data.searchDateS && data.searchDateS)) {
            errMsg = "請填寫完整的起訖範圍！";
        };

        // 狀態驗證
        console.log('String(data.status) !== "null"', String(data.status) !== "null", String(data.status));
        if (String(data.status) !== "null") {
            console.log(String(data.status))
            if ((data.status !== -1) && (data.status !== 0) && (data.status !== 1)) {
                errMsg = "請輸入正確的上映狀態！";
            };
        };


        return errMsg;
    }


    // 列表- 取得查詢條件（準備和資料庫比對）
    getListCondition(queryData: any) {
        console.log('queryData', queryData);
        let condition = {};

        if (queryData.title) {
            condition["title"] = queryData.title;
        };

        if (queryData.searchDateS && queryData.searchDateE) {
            condition["releaseDate"] = {
                $gte: queryData.searchDateS,
                $lte: queryData.searchDateE
            };
        };

        if (queryData.status !== null) {
            condition["status"] = queryData.status;
        };

        console.log('condition- mapping資料庫前', condition);
        return condition;
    }



    // 列表- 整理列表資料   // ====待優化====
    setListData(movieData: any, optionsData: any) {
        let listData: any[] = [];
        console.log('optionsData', optionsData);

        if (movieData.length) {
            movieData.forEach((movie) => {
                let obj = {
                    _id: movie._id,
                    status: movie.status,
                    title: movie.title,
                    genreName: this.getOptionTransListName(movie.genre, optionsData.genre),
                    rateName: (optionsData.rate.filter(val => val.value === movie.rate)[0]).name,
                    releaseDate: movie.releaseDate,
                    provideVersionName: this.getOptionTransListName(movie.provideVersion, optionsData.provideVersion),
                };
                listData.push(obj);
            });
        };

        return listData;
    }



    // 取得選項中文名稱（多個）
    getOptionTransListName(valueList: number[], optionData: CommonOptionSuccessDataItem[]): string[] {
        let nameList: string[] = [];

        valueList.forEach((value) => {
            let name = (optionData.filter((option) => option.value === value)[0]).name;
            nameList.push(name);
        });

        return nameList;
    }


}



export default new MovieController();