import { Request, Response, NextFunction } from 'express';
import Transaction from '../../models/staff/transactionModels';
// import ErrorService from '../../service/error';
class TransactionController {
    constructor(){    
    }

    // ———————————————————————  取得訂單  ———————————————————————
    getTransaction = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const transaction = await Transaction.find({});
            res.status(200).json({
                code: 1,
                message: "成功取得訂單",
                data: transaction
            });
        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "取得訂單錯誤",
            });
        };
    }

    // ———————————————————————  新增訂單  ———————————————————————
    createTransaction = async (req: Request<{}, {}, any>, res: Response, next: NextFunction) => {
        try {
            // const transction = await Transaction.findOne({ type: req.body.type });
            // if(!!transction){
            //     return next(ErrorService.appError(404, "已有相同訂單", next));
            // }
            await Transaction.create(
                {
                    customerid: req.body.customerid ?? 1,
                    paymentMethod: req.body.paymentMethod ?? 1,
                    amount: req.body.amount ?? 1000,
                    status: req.body.status ?? 0
                }
            );
            res.status(200).json({
                code: 1,
                message: "成功新增訂單",
                data: null
            });
        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "新增訂單錯誤(其它)!",
            });
        };
    }

    
}

export default new TransactionController();

