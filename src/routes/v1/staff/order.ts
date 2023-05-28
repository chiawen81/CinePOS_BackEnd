const express = require('express');
const router = express.Router();
import OrderController from '../../../controller/staff/order.controller';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';

// 結帳
router.post('/', AuthService.isEmpAuth, ErrorService.handleErrorAsync(OrderController.createOrder));

// 查詢訂單
router.get('/:orderId', AuthService.isEmpAuth, ErrorService.handleErrorAsync(OrderController.getOrder));



export const StaffOrderRouter = router;