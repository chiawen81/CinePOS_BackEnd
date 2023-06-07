const express = require('express');
const router = express.Router();
import RefundController from '../../../controller/staff/refund.controller';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';


// 查詢訂單
router.get('/:orderId', AuthService.isEmpAuth, ErrorService.handleErrorAsync(RefundController.getOrder));



export const StaffRefundRouter = router;