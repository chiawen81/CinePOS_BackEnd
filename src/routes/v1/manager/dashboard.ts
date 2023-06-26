const express = require('express');
const router = express.Router();
import DashboardController from '../../../controller/manager/dashboard';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';
import ResponseService from '../../../service/response';


// 取得指標
router.get('/metric', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(DashboardController.getMetric));

// 電影票房(圖表資料)
router.get('/boxOffice', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(DashboardController.getBoxOfficeStatistics));



export const ManagerDashboardRouter = router;