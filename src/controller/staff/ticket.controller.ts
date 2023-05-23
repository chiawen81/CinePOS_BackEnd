import { Request, Response, NextFunction } from 'express';
import Transaction from 'src/models/staff/transactionModels';

class TicketController {
    constructor(){    
    }

    // ———————————————————————  取得訂單  ———————————————————————
    getTransaction = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ticketType = await Transaction.find({});
            res.status(200).json({
                code: 1,
                message: "成功取得訂單",
                data: ticketType
            });
        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "取得訂單錯誤",
            });
        };
    }

    // ———————————————————————  新增訂單  ———————————————————————
    // createTicketType = async (req: Request<{}, {}, any>, res: Response, next: NextFunction) => {
    //     try {
    //         const ticketType = await TicketTypes.findOne({ type: req.body.type });
    //         if(!!ticketType){
    //             return next(ErrorService.appError(404, "已有相同票種", next));
    //         }
    //         await TicketTypes.create(
    //             {
    //                 type: req.body.type,
    //                 price: req.body.price,
    //             }
    //         );
    //         res.status(200).json({
    //             code: 1,
    //             message: "成功新增票種",
    //             data: null
    //         });
    //     } catch (err) {
    //         res.status(500).json({
    //             code: -1,
    //             message: err.message || "新增票種錯誤(其它)!",
    //         });
    //     };
    // }

    
}

export default new TicketController();

