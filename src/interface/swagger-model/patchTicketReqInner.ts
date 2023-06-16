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

export interface PatchTicketReqInner { 
    /**
     * ticketID
     */
    id: string;
    /**
     * 是否退票
     */
    isRefund: boolean;
    /**
     * 退票方式(0:無、1:現金、2:line Pay)
     */
    refundMethod: number;
}