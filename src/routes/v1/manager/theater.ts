const express = require('express');
const router = express.Router();
import TheaterController from '../../../controller/manager/theater';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';

// 查詢影廳列表
router.get('/list', AuthService.isEmpAuth, ErrorService.handleErrorAsync(TheaterController.getTheaterList));

// 新增影廳
router.post('/', AuthService.isEmpAuth, ErrorService.handleErrorAsync(TheaterController.createTheater));

export const ManagerTheaterRouter = router;