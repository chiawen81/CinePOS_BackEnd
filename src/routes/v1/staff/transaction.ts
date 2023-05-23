const express = require('express');
const router = express.Router();
// import ErrorService from '../../../service/error';
// import AuthService from '../../../service/auth';
import transactionController from '../../../controller/staff/transaction.controller';

// 取得訂單
router.get('/', transactionController.getTransaction);
// // 新增訂單(單筆)
router.post('/', transactionController.createTransaction);


export const StaffTransactionRouter = router;    