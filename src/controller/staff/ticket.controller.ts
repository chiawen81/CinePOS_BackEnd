import { Request, Response, NextFunction } from 'express';
import Ticket from '../../models/ticketModels';

class TicketController {
    constructor() {

    }


    // ———————————————————————  新增電影票  ———————————————————————
    createTicket = async (req: Request<{}, {}, any>, res: Response, next: NextFunction) => {
        try {
            const result = await Ticket.insertMany(req.body.ticketData);
            let ticketIdArr = [];
            result.forEach(item => {
                ticketIdArr.push(item.id)
            });
            res.status(200).json({
                code: 1,
                message: "成功新增電影票",
                data: ticketIdArr
            });
        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "新增票種錯誤(其它)!",
            });
        }
    };
    // ———————————————————————  更新電影票狀態  ———————————————————————
    updateTicketStatus = async (req, res: Response, next: NextFunction) => {
        try {
            const reqArr = req.body;
            for (let i = 0; i < reqArr.length; i++) {
                await Ticket.findByIdAndUpdate(reqArr[i].id,
                    {
                        "isRefund": reqArr[i].isRefund,
                        "refundMethod": reqArr[i].refundMethod
                    }
                )
            }
            const resData = req.body;
            res.status(200).json({
                code: 1,
                message: "成功修改電影票狀態!",
            });
        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "更新電影票狀態錯誤(其它)!",
            });
        };
    }
    // ———————————————————————  刪除電影票(可多筆)  ———————————————————————
    deleteTicket = async (req, res: Response, next: NextFunction) => {
        try {
            const reqArr = req.body;
            for (let i = 0; i < reqArr.length; i++) {
                await Ticket.findByIdAndDelete(reqArr[i])
            }
            const resData = req.body;
            res.status(200).json({
                code: 1,
                message: "成功刪除電影票",
            });
        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "更新電影票狀態錯誤(其它)!",
            });
        };
    }

}



export default new TicketController();