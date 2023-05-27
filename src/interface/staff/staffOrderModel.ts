import { StaffOrderCreateReqTicketList } from "../swagger-model/staffOrderCreateReqTicketList";

export interface StaffOrderCreateModel {
    // order資料庫欄位

    _id?: string;
    orderId: string;
    status: number;
    createdAt?: Date;
    updatedAt?: Date;
    /**
     * 付款方式(1:現金,2:Line Pay)
     */
    paymentMethod: number;
    /**
     *  訂單總金額
     */
    amount: number;
    ticketList: Array<StaffOrderCreateReqTicketList>;
}