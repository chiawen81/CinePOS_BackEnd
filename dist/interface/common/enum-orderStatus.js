"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumOrderStatus = void 0;
var EnumOrderStatus;
(function (EnumOrderStatus) {
    EnumOrderStatus[EnumOrderStatus["PAYMENT_FAILED"] = -1] = "PAYMENT_FAILED";
    EnumOrderStatus[EnumOrderStatus["UNPAID"] = 0] = "UNPAID";
    EnumOrderStatus[EnumOrderStatus["PAID"] = 1] = "PAID";
    EnumOrderStatus[EnumOrderStatus["PAYMENT_IN_PROGRESS"] = 2] = "PAYMENT_IN_PROGRESS";
    EnumOrderStatus[EnumOrderStatus["REFUNDED"] = 3] = "REFUNDED";
})(EnumOrderStatus = exports.EnumOrderStatus || (exports.EnumOrderStatus = {}));
