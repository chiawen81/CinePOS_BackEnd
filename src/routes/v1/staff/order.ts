const express = require('express');
const router = express.Router();
import OrderController from '../../../controller/staff/order.controller';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';
import ResponseService from '../../../service/response';

// 結帳
router.post('/', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(OrderController.createOrder));

// 查詢訂單
router.get('/:orderId', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(OrderController.getOrder));

// 更新訂單狀態
router.patch('/', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(OrderController.updateOrderStatus))

export const StaffOrderRouter = router;