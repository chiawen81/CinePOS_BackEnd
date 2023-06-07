import { Response, NextFunction } from 'express';
import ErrorService from '../../service/error';
import Order from '../../models/orderModels';
import Seat from '../../models/seats.model';
import Ticket from '../../models/ticketModels';
import Movie from '../../models/moviesModels';
import TicketTypes from '../../models/ticketTypeModels';
import Timetable from '../../models/timetable.model';


import { StaffOrderSearchSuccessData } from 'src/interface/swagger-model/staffOrderSearchSuccessData';


class RefundController {
    constructor() {
    }

    /**查詢訂單 */
    getOrder = async (req, res: Response, next: NextFunction) => {
        try {
            const order = await Order.findByIdAndUpdate(req.params['orderId'])
            if(!order){
                return next(ErrorService.appError(404, "沒有這筆訂單！", next));
            }
            const resData: StaffOrderSearchSuccessData = {};
            resData.orderId = String(order['_id']);
            resData.ticketList = await findOrderInfo(order.ticketList);
            res.status(200).json({
                code: 1,
                message: "OK",
                data: resData
            });
        } catch (err) {
            res.status(500).json({
                code: -1,
                message: err.message || "取得訂單錯誤(其它)!",
            });
        };
    }


}

// 將訂單資訊解析
async function findOrderInfo(ticketArr) {
    let ticketList = [];
    for (let i = 0; i < ticketArr.length; i++) {
        const movie = await Movie.findByIdAndUpdate(ticketArr[i].movieId)
        const ticketType = await TicketTypes.findByIdAndUpdate(ticketArr[i].ticketTypeId)
        const seat = await Seat.findByIdAndUpdate(ticketArr[i].seatId)
        const schedule = await Timetable.findByIdAndUpdate(ticketArr[i].scheduleId)
        const ticket = await Ticket.findByIdAndUpdate(ticketArr[i].ticketId)
        ticketList.push({
            title: movie['title'],
            ticketId: ticketArr[i].ticketId,
            ticketStatus: ticket['isRefund']? 1:0,
            seatId: ticketArr[i].seatId,
            seatName: seat['seatName'],
            ticketType: ticketType['type'],
            price: ticketArr[i].price,
            startDate: schedule['startDate']
        })
    }
    return ticketList;
}

export default new RefundController();
