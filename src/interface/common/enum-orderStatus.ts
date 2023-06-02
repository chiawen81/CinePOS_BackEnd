export enum EnumOrderStatus {
    /**
     * 付款失敗
     */
    PAYMENT_FAILED = -1,

    /**
     * 未付款
     */
    UNPAID = 0,

    /**
     * 已付款
     */
    PAID = 1,

    /**
     * 付款中
     */
    PAYMENT_IN_PROGRESS = 2,

    /**
     * 退款
     */
    REFUNDED = 3,
}