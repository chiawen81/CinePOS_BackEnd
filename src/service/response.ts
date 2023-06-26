import { NextFunction, Request, Response } from 'express';

class ResponseService {
    // ——————————  設定的 header  ——————————
    setHeaderCROS = (req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    };

}



export default new ResponseService();