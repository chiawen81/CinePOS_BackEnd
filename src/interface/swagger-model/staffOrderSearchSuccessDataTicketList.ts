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

export interface StaffOrderSearchSuccessDataTicketList { 
    /**
     * 電影名稱
     */
    title: string;
    /**
     * 票券ID
     */
    ticketId: string;
    /**
     * 票種名稱
     */
    ticketType: string;
    /**
     * 票券狀態(1:已退,0:未退)
     */
    ticketStatus?: number;
    /**
     * 票價
     */
    price: number;
    /**
     * 場次開始時間
     */
    time: string;
    /**
     * 座位ID
     */
    seatId: string;
    /**
     * 座位號
     */
    seatName: string;
}