import { Request, Response, NextFunction } from 'express';
import Movie from '../../models/manager/moviesModels';
import ErrorService from './../../service/error';

class MovieController {
    constructor() {

    }

    // ———————————————————————  取得資料  ———————————————————————
    getInfo = async (req, res: Response, next: NextFunction) => {
        let movieId = req.params.id;
        console.log('movieId', movieId);
        const movie = await Movie.findOne({ id: movieId });
        console.log('movie', movie);
        if (!movie) {
            return next(ErrorService.appError(404, "沒有這筆電影資料！", next));
        };


        try {
            res.status(200).json({
                code: 1,
                message: "成功取得電影資料!",
                data: movie
            });
        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "取得電影資料錯誤(其它)!",
            });
        };
    }





    // ———————————————————————  更新資料  ———————————————————————
    createInfo = async (req: Request<{}, {}, any>, res: Response, next: NextFunction) => {

    }





    // ———————————————————————  更新資料  ———————————————————————
    updateInfo = async (req: Request<{}, {}, any>, res: Response, next: NextFunction) => {

    }





}



export default new MovieController();