import { Request, Response, NextFunction } from 'express';
import Movie from '../../models/moviesModels';
import ErrorService from './../../service/error';
import Option from '../../models/optionsModels';
import { MovieDetailGetInfoSuccess } from 'src/interface/swagger-model/movieDetailGetInfoSuccess';
import { MovieDetailCreateParameter } from 'src/interface/swagger-model/movieDetailCreateParameter';
import { MovieDetailCreateSuccess } from 'src/interface/swagger-model/movieDetailCreateSuccess';
import { CommonOptionSuccessDataItem } from 'src/interface/swagger-model/commonOptionSuccessDataItem';
import { ManagerMovieListSuccess } from 'src/interface/swagger-model/managerMovieListSuccess';
import { ManagerMovieListPara } from 'src/interface/manager';
import { ManagerMovieListSuccessDataInnerCustomer, MovieDetailUpdateParameterCustomer } from 'src/interface/manager';
import { MovieDetailUpdateSuccess } from 'src/interface/swagger-model/movieDetailUpdateSuccess';
import { MovieDetailDeleteSuccess } from 'src/interface/swagger-model/movieDetailDeleteSuccess';
import { MovieStatusPara } from 'src/interface/swagger-model/movieStatusPara';



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
        const reqData = req.body;       // client端傳過來的參數
        // console.log('reqData', reqData);

        // 驗證client端參數
        let isParaValid = this.isMovieParaValid(reqData, false);
        console.log('isParaValid ', isParaValid)
        if (!isParaValid.valid) {
            return next(ErrorService.appError(400, isParaValid.errMsg, next));
        };
        console.log('通過驗證！');

        try {
            // 新增資料至movies資料庫
            let newMovieData = await Movie.create(reqData);
            console.log('新增電影資料成功');

            // 回傳成功訊息給client端
            res.status(201).json({
                code: 1,
                message: '電影資料新增成功！',
                data: newMovieData
            });

        } catch (err) {
            console.log('error', err);
            return next(ErrorService.appError(500, `電影資料新增失敗！${err.message}`, next));
        };
    }



    // 新增- 驗證client端參數
    isMovieParaValid(reqData: MovieDetailCreateParameter | MovieDetailUpdateParameterCustomer, isUpdate: boolean): { valid: boolean, errMsg: string } {
        let result: { valid: boolean, errMsg: string } = { valid: true, errMsg: "" };

        if (isUpdate && !(reqData as MovieDetailUpdateParameterCustomer)._id) {
            return result = { valid: false, errMsg: "請輸入電影系統編號！" };
        };

        // 電影名稱
        if (!reqData.title) {
            return result = { valid: false, errMsg: "請輸入電影名稱！" };
        };

        // 電影類型
        if (!reqData.genre.length) {
            return result = { valid: false, errMsg: "請輸入電影類型！" };
        };

        // 片長
        if (!reqData.runtime) {
            return result = { valid: false, errMsg: "請輸入片長！" };
        };

        // 支援設備
        if (!reqData.provideVersion.length) {
            return result = { valid: false, errMsg: "請輸入支援設備！" };
        };

        // 電影分級
        if (reqData.rate === null) {
            return result = { valid: false, errMsg: "請輸入電影分級！" };
        };

        // 上映狀態
        if (reqData.status === null) {
            return result = { valid: false, errMsg: "請輸入上映狀態！" };
        };

        // 上映日期
        if (!reqData.releaseDate) {
            return result = { valid: false, errMsg: "請輸入上映日期！" };
        };

        // 海報連結
        if (!reqData.posterUrl) {
            return result = { valid: false, errMsg: "請輸入海報連結！" };
        };

        return result;
    }





    // ———————————————————————  更新資料  ———————————————————————
    updateInfo = async (req: Request<{}, MovieDetailUpdateSuccess, MovieDetailUpdateParameterCustomer, null, {}>, res: Response, next: NextFunction) => {
        const reqData = req.body;       // client端傳過來的參數
        console.log('更新資料- reqData', reqData);

        // 驗證client端參數
        let isParaValid = this.isMovieParaValid(reqData, true);
        console.log('isParaValid ', isParaValid)
        if (!isParaValid.valid) {
            return next(ErrorService.appError(400, isParaValid.errMsg, next));
        };
        console.log('通過驗證！');


        try {
            const movieId = req.body._id;
            const movieData = req.body;
            console.log('movieId', movieId, 'movieData', movieData);

            // 檢查電影資料是否存在
            const updatedMovie = await Movie.findOneAndUpdate(
                { _id: movieId },                        // 比對條件
                movieData,                               // 更新的內容
                { new: true }
            );

            if (updatedMovie) {
                res.status(200).json({
                    code: 1,
                    message: '電影資料更新成功！',
                    data: updatedMovie,
                });

            } else {
                return res.status(401).json({
                    code: -1,
                    message: '找不到此電影資料！',
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
    getList = async (req: Request<{}, ManagerMovieListSuccess, {}, {}, {}>, res: Response, next: NextFunction) => {
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
    getListQuery(data: ManagerMovieListPara): ManagerMovieListPara {
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
    getListQueryValidatorErrMsg(data: ManagerMovieListPara): string {
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
    getListCondition(queryData: ManagerMovieListPara): ManagerMovieListPara {
        console.log('queryData', queryData);
        let condition = {};

        if (queryData.title) {
            condition["title"] = { $regex: `.*${queryData.title}.*`, $options: 'i' };
            // note: 
            // $options: "i" => 不分大小寫
            // .*放在字串前後 => 可以模糊查詢
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
    setListData(movieData: any, optionsData: any): ManagerMovieListSuccessDataInnerCustomer[] {
        let listData: ManagerMovieListSuccessDataInnerCustomer[] = [];
        console.log('optionsData', optionsData);

        if (movieData.length) {
            movieData.forEach((movie) => {
                let obj: ManagerMovieListSuccessDataInnerCustomer = {
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





    // ———————————————————————  更新電影上映狀態  ———————————————————————
    updateReleaseStatus = async (req: Request<{}, MovieDetailCreateSuccess, MovieStatusPara, {}, {}>, res: Response, next: NextFunction) => {
        let reqData: MovieStatusPara = req.body;

        if (!((typeof reqData.status === 'number') && (typeof reqData.movieId === 'string'))) {
            return next(ErrorService.appError(400, "重送參數資料格式錯誤！", next));
        };

        try {
            let movieData = await Movie.findOneAndUpdate(
                { _id: reqData.movieId },
                { status: reqData.status },                               // 更新的內容
                { new: true }
            );
            console.log('movieData-更新電影上映狀態', movieData);

            if (movieData) {
                res.status(200).json({
                    code: 1,
                    message: "更新電影上映狀態成功！",
                    data: movieData
                });

            } else {
                res.status(422).json({
                    code: -1,
                    message: '查無電影！',
                });

            };

        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || '更新電影上映狀態失敗(其它)！',
            });
        };
    }





    // ———————————————————————  刪除電影  ———————————————————————
    deleteMovie = async (req: Request<{}, MovieDetailDeleteSuccess, {}, {}, {}>, res: Response, next: NextFunction) => {
        console.log('抓到路由- delete')
        let movieId = req.params["id"];
        console.log('movieId', movieId);
        if (!movieId) {
            return next(ErrorService.appError(400, "請輸入電影編號！", next));
        };

        // 刪除電影
        let movieData = await Movie.findByIdAndRemove(movieId);
        console.log('movieData', movieData);

        try {
            if (movieData) {
                res.status(200).json({
                    code: 1,
                    message: "刪除成功！"
                });

            } else {
                res.status(422).json({
                    code: -1,
                    message: '查無電影！',
                });
            };

        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || '刪除電影失敗(其它)！',
            });
        };
    }





    // ———————————————————————  取得chatGPT的金鑰  ———————————————————————
    getChatGPTKey = async (req: Request<{}, MovieDetailDeleteSuccess, {}, {}, {}>, res: Response, next: NextFunction) => {
        let key: string = process.env.CHATGPT_TOKEN;

        try {
            res.status(200).json({
                code: 1,
                message: "成功取得ChatGPT金鑰！",
                data: key
            });

        } catch (err) {
            res.status(500).json({
                code: -1,
                message: `取得ChatGPT金鑰失敗！錯誤訊息：${err.message}`,
            });
        };
    }


}



export default new MovieController();