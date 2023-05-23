const express = require('express');
const router = express.Router();
import TheaterController from '../../../controller/manager/theater';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';

// 查詢影廳列表
router.get('/list', AuthService.isEmpAuth, ErrorService.handleErrorAsync(TheaterController.getTheaterList));

export const ManagerTheaterRouter = router;