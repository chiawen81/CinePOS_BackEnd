import { Request, Response, NextFunction } from 'express';
import ErrorService from '../../service/error';
import Order from '../../models/orderModels';
import Seat from '../../models/seats.model';
import Ticket from '../../models/ticketModels';
import TicketTypes from '../../models/ticketTypeModels';
import Movie from '../../models/moviesModels';
import Timetable from '../../models/timetable.model';
import { StaffOrderCreateReq } from 'src/interface/swagger-model/staffOrderCreateReq';
import { StaffOrderCreateSuccess } from 'src/interface/swagger-model/staffOrderCreateSuccess';
import { StaffOrderSearchSuccess } from 'src/interface/swagger-model/staffOrderSearchSuccess';
import { StaffOrderCreateSuccessData } from 'src/interface/swagger-model/staffOrderCreateSuccessData';
import { StaffOrderCreateSuccessDataTicketList } from 'src/interface/swagger-model/staffOrderCreateSuccessDataTicketList';
import { StaffOrderCreateModel } from 'src/interface/staff/staffOrderModel';
import { TicketTypeResDataCustomer } from 'src/interface/staff';
import { ErrorInfo } from 'src/interface/common';
import { StaffOrderCreateReqTicketList } from 'src/interface/swagger-model/staffOrderCreateReqTicketList';
import { StaffOrderSearchSuccessData } from 'src/interface/swagger-model/staffOrderSearchSuccessData';
const mongoose = require('mongoose');


const uuid = require('uuid');


class OrderController {
    constructor() {

    }

    // ———————————————————————  結帳  ———————————————————————
    createOrder = async (req: Request<{}, StaffOrderCreateSuccess, StaffOrderCreateReq, null, {}>, res: Response, next: NextFunction) => {
        let orderId = uuid.v4();
        let ticketTypeData: TicketTypeResDataCustomer[];

        // 驗證傳過來的參數
        let isParaValid = this.isCreateOrderParaValid(req.body);
        if (!isParaValid.valid) {
            return next(ErrorService.appError(400, isParaValid.errMsg, next));
        };
        console.log('通過驗證！');
        try {
            // 取到ticketType全部資料
            ticketTypeData = await TicketTypes.find({});
            console.log('ticketType全部資料', ticketTypeData);

            // 新增資料至order資料庫、更新seat資料庫(售出狀態)
            this.getNewOrderDataAndUpdateSeatDatabase(req.body, orderId)
                .then((newOrderData: StaffOrderCreateModel) => {
                    console.log('newOrderData-主程式', newOrderData);
                    return Order.create(newOrderData);
                })
                .then((newOrderData) => {
                    // 回傳成功訊息給client端
                    console.log('newOrderData-新增order資料庫', newOrderData);
                    let successData = this.setCreateOrderSuccessData((req.body as StaffOrderCreateReq), ticketTypeData, orderId);
                    console.log('successData-res', successData);

                    res.status(200).json({
                        code: 1,
                        message: "結帳成功!",
                        data: successData
                    });

                    return newOrderData;
                })
                .then((newOrderData) => {
                    console.log('newOrderData-新增order資料庫', newOrderData);
                    // 更新ticket資料庫(訂單ID)
                    this.updateTicketDatabase((newOrderData as any), next);
                })
                .catch((err) => {
                    return next(this.createOrderError(req.body, orderId, 500, `結帳過程發生錯誤！已更新資料庫${err.message}`, next));
                });

        } catch (err) {
            return next(this.createOrderError(req.body, orderId, 500, `結帳過程發生錯誤！已更新資料庫${err.message}`, next));
        };
    }



    // 結帳- 更新票券的訂單ID
    async updateTicketDatabase(newOrderData: StaffOrderCreateModel, next: NextFunction) {
        for (const val of newOrderData.ticketList) {
            console.log('valvalval', val);
            try {
                let ticketData = await Ticket.findOneAndUpdate(
                    { _id: val.ticketId },                                                      // 條件
                    { orderId: newOrderData.orderId },                                          // 更新的內容
                    { new: true }                                                               // 參數
                );
                console.log('ticketData', ticketData);

            } catch (err) {
                return next(ErrorService.appError(500, `更新票券資料庫過程發生錯誤！發生錯誤的ticketId:${val.ticketId}`, next));
            };
        };
    }



    // 結帳- 要回傳給前端的資料
    setCreateOrderSuccessData(reqData: StaffOrderCreateReq, ticketTypeData: TicketTypeResDataCustomer[], orderId: string): StaffOrderCreateSuccessData {
        console.log('newOrderData-要回傳給前端的資料', reqData, ticketTypeData);
        let ticketList: StaffOrderCreateSuccessDataTicketList[] = [];


        for (const newTicket of reqData.ticketList) {
            let targetTicketType;

            ticketTypeData.forEach(val => {
                if (val._id.toString() == newTicket.ticketTypeId) {
                    targetTicketType = val;
                };
            });

            console.log('targetTicketType', targetTicketType);
            ticketList.push({
                ticketId: newTicket.ticketId.toString(),
                type: targetTicketType.type,
                seatName: newTicket.seatName
            });
        };

        let successData: StaffOrderCreateSuccessData = {
            orderId: orderId,
            paymentMethod: reqData.paymentMethod,
            amount: reqData.amount,
            ticketList: ticketList
        };

        console.log('successData', successData);
        return successData;
    }



    // 結帳- 整理要寫進order資料庫的資料
    async getNewOrderDataAndUpdateSeatDatabase(reqData: StaffOrderCreateReq, orderId: string): Promise<StaffOrderCreateModel> {
        let newOrderData: StaffOrderCreateModel;
        let newOrderTicketList: StaffOrderCreateSuccessDataTicketList[] = [];
        console.log('reqData-整理要寫進order資料庫的資料', reqData);


        // 組票券相關資料
        for (const reqTicketData of reqData.ticketList) {
            // 取得座位資料、更新seat資料庫 
            console.log('搜尋seatData 條件', { _id: reqTicketData.scheduleId, seatName: reqTicketData.seatName });

            let seatData = await Seat.findOneAndUpdate(
                { scheduleId: reqTicketData.scheduleId, seatName: reqTicketData.seatName }, // 條件
                { status: EnumSeatStatus.SOLD },                                            // 更新的內容
                { new: true }                                                               // 參數
            );
            console.log('找到seatData', seatData);

            // 資料庫
            let newOrderObj = {
                ticketId: new mongoose.Types.ObjectId(reqTicketData.ticketId),
                seatId: seatData._id,
                price: reqTicketData.price,
                ticketTypeId: new mongoose.Types.ObjectId(reqTicketData.ticketTypeId),
                movieId: new mongoose.Types.ObjectId(reqTicketData.movieId),
                scheduleId: new mongoose.Types.ObjectId(reqTicketData.scheduleId)
            };
            newOrderTicketList.push(newOrderObj);

        };

        // 組新訂單資料(資料庫)
        newOrderData = {
            orderId: orderId,
            status: EnumOrderStatus.PAID,
            paymentMethod: reqData.paymentMethod,
            amount: reqData.amount,
            ticketList: newOrderTicketList,
        };

        console.log('newOrderData', newOrderData);
        return newOrderData;

        // 踩坑note:
        // 由於forEach 是一個同步操作，它不會等待內部的 await 完成，而是立即執行下一個迴圈。因此，這裡要用for迴圈
        // for迴圈可以確保所有 await 都執行完畢後再繼續後續操作，而且支援 await 並提供迭代控制
    }



    // 結帳- 驗證client端參數
    isCreateOrderParaValid(reqData: StaffOrderCreateReq): { valid: boolean, errMsg: string } {
        let result: { valid: boolean, errMsg: string } = { valid: true, errMsg: "" };

        // 付款方式
        if (!reqData.paymentMethod) {
            return result = { valid: false, errMsg: "未填寫付款方式" };
        };

        // 總金額
        if (!reqData.amount) {
            return result = { valid: false, errMsg: "未填寫總金額" };
        };

        // 票券相關訊息
        if (reqData.ticketList.length === 0) {
            return result = { valid: false, errMsg: "未填寫票券資訊" };

        } else {
            (reqData.ticketList).forEach(data => {
                if (!data.ticketId) {
                    return result = { valid: false, errMsg: "有票券資訊未填寫票券ID" };
                };

                if (!data.price) {
                    return result = { valid: false, errMsg: "有票券資訊未填寫金額" };
                };

                if (!data.ticketTypeId) {
                    return result = { valid: false, errMsg: "有票券資訊未填寫票種ID" };
                };

                if (!data.movieId) {
                    return result = { valid: false, errMsg: "有票券資訊未填寫電影ID" };
                };

                if (!data.scheduleId) {
                    return result = { valid: false, errMsg: "有票券資訊未填寫場次ID" };
                };
            });
        };

        return result;
    }



    // 結帳失敗
    createOrderError = (reqData: StaffOrderCreateReq, orderId: string, httpStatus: number, errMessage: string, next: NextFunction) => {
        const error: ErrorInfo = new Error(errMessage);
        error.statusCode = httpStatus;
        error.isOperational = true;
        error.errMessage = errMessage;
        console.log('appError', httpStatus, errMessage);

        this.updateOrderDatabaseStatus(orderId, EnumOrderStatus.PAYMENT_FAILED);       // 更新訂單資料庫- 狀態

        // 更新資料庫
        for (const reqTicketData of reqData.ticketList) {
            this.updateSeatDatabaseStatus(reqTicketData, EnumSeatStatus.FREE);        // 更新座位資料庫- 狀態
            this.updateTicketDatabaseOrderId(orderId, reqTicketData.ticketId);        // 更新票券資料庫- 訂單編號
        };

        next(error);
    }



    // 結帳失敗- 更新座位資料庫:狀態
    async updateSeatDatabaseStatus(reqTicketData: StaffOrderCreateReqTicketList, status: EnumSeatStatus) {
        // 取得座位資料、更新seat資料庫 
        console.log('搜尋seatData 條件', { _id: reqTicketData.scheduleId, seatName: reqTicketData.seatName });

        let seatData = await Seat.findOneAndUpdate(
            { scheduleId: reqTicketData.scheduleId, seatName: reqTicketData.seatName }, // 條件
            { status: status },                                                         // 更新的內容
            { new: true }                                                               // 參數
        );
        console.log('找到seatData', seatData);
    };



    // 結帳失敗- 更新訂單資料庫:狀態
    async updateOrderDatabaseStatus(orderId: string, status: EnumOrderStatus) {
        let OrderData = await Order.find({ _id: orderId });

        if (OrderData) {
            await Order.findOneAndUpdate(
                { _id: orderId },
                { status: status },
                { new: true }
            );
        };

        console.log('更新訂單狀態', OrderData);
    };



    // 結帳失敗- 更新票券資料庫:訂單編號
    async updateTicketDatabaseOrderId(orderId: string, ticketId: string) {
        let ticketData = await Ticket.find({ _id: ticketId });
        console.log('ticketData', ticketData);

        if (ticketData) {
            let updateTicketData = await Ticket.findOneAndUpdate(
                { _id: ticketId },
                { orderId: orderId },
                { new: true }
            );

            console.log('updateTicketData', updateTicketData);
        };
    }





    // —————————————————————  查詢訂單  —————————————————————
    getOrder = async (req: Request<{}, StaffOrderSearchSuccess, {}, string, {}>, res: Response, next: NextFunction) => {
        try {
            const order = await Order.findByIdAndUpdate(req.params['orderId'])
            if(!order){
                return next(ErrorService.appError(404, "沒有這筆訂單！", next));
            }
            const resData: StaffOrderSearchSuccessData = {
                orderId: '',
                ticketList: []
            };
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
            time: schedule['startDate'],
            seatId: ticketArr[i].seatId,
            seatName: seat['seatName'],
            ticketType: ticketType['type'],
            price: ticketArr[i].price,
            
        })
    }
    return ticketList;
}

export default new OrderController();

// 座位狀態
export enum EnumSeatStatus {
    FREE = 0,                   // 未售 (free)
    SOLD = 1,                   // 已售 (sold)
    LOCKED = 2,                 // 鎖定中 (lock)
    NONE = 3,                   // 暫停販售 (none)
}

// 訂單狀態
export enum EnumOrderStatus {
    PAYMENT_FAILED = -1,        // 付款失敗
    UNPAID = 0,                 // 未付款
    PAID = 1,                   // 已付款
    PAYMENT_IN_PROGRESS = 2,    // 付款中
    REFUNDED = 3,               // 退款
}