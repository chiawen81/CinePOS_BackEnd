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


}



export default new TicketController();