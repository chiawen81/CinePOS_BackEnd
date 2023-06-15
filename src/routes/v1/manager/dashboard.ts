const express = require('express');
const router = express.Router();
import DashboardController from '../../../controller/manager/dashboard';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';

// 取得指標
router.get('/metric', AuthService.isEmpAuth, ErrorService.handleErrorAsync(DashboardController.getMetric));

// 電影票房
router.get('/boxOffice', AuthService.isEmpAuth, ErrorService.handleErrorAsync(DashboardController.getBoxOfficeStatistics));



export const ManagerDashboardRouter = router;