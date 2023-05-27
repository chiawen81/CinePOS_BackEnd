import { Request, Response, NextFunction } from 'express';
import ErrorService from '../../service/error';


class OrderController {
    constructor() {

    }

    // ———————————————————————  結帳  ———————————————————————
    createOrder = async (req: Request<{}, {}, {}, {}, {}>, res: Response, next: NextFunction) => {



        if (false) {
            return next(ErrorService.appError(404, "已有相同票種", next));
        };

    }



    // —————————————————————  查詢訂單  —————————————————————
    getOrder = async (req: Request<{}, {}, {}, {}, {}>, res: Response, next: NextFunction) => {




    }


}



export default new OrderController();