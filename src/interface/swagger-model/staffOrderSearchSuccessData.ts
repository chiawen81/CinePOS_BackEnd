/**
 * CinePOS_BackEnd
 * CinePOS 後端API
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { StaffOrderSearchSuccessDataTicketList } from './staffOrderSearchSuccessDataTicketList';

export interface StaffOrderSearchSuccessData { 
    /**
     * 訂單ID
     */
    orderId: string;
    /**
     * 訂單總金額
     */
    amount: number;
    ticketList: Array<StaffOrderSearchSuccessDataTicketList>;
}