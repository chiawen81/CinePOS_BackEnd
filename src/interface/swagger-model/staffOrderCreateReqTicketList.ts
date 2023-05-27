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

export interface StaffOrderCreateReqTicketList { 
    /**
     * 票券ID
     */
    ticketId?: string;
    /**
     * 票價
     */
    price?: number;
    /**
     * 票種ID
     */
    ticketTypeId?: string;
    /**
     * 電影ID
     */
    movieId?: string;
    /**
     * 場次ID
     */
    scheduleId?: string;
}