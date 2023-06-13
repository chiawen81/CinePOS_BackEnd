"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffOrderRouter = void 0;
const express = require('express');
const router = express.Router();
const order_controller_1 = __importDefault(require("../../../controller/staff/order.controller"));
const error_1 = __importDefault(require("../../../service/error"));
const auth_1 = __importDefault(require("../../../service/auth"));
router.post('/', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(order_controller_1.default.createOrder));
router.get('/:orderId', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(order_controller_1.default.getOrder));
router.patch('/', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(order_controller_1.default.updateOrderStatus));
exports.StaffOrderRouter = router;
