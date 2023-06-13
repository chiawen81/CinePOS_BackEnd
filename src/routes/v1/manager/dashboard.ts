const express = require('express');
const router = express.Router();
import DashboardController from '../../../controller/manager/dashboard';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';

// 取得票房資訊
router.get('/metric', AuthService.isEmpAuth, ErrorService.handleErrorAsync(DashboardController.getMetric));


export const ManagerDashboardRouter = router;