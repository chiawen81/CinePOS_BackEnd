const express = require('express');
const router = express.Router();
import TheaterController from '../../../controller/manager/theater';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';
import ResponseService from '../../../service/response';

// 查詢影廳列表
router.get('/list', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(TheaterController.getTheaterList));

// 新增影廳
router.post('/', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(TheaterController.createTheater));

// 查詢影廳使用狀況
router.get('/:theaterId/usage', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(TheaterController.getTheaterUsage));

// 查詢影廳
router.get('/:theaterId', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(TheaterController.getTheater));

// 編輯影廳
router.patch('/:theaterId', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(TheaterController.updateTheater));

// 刪除影廳
router.delete('/:theaterId', AuthService.isEmpAuth, ErrorService.handleErrorAsync(TheaterController.deleteTheater));

// 上/下架影廳
router.patch('/:theaterId/onoffline', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(TheaterController.updateTheaterStatus));

// insert seats data
router.post('/insertSeat', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(TheaterController.insertSeat));

export const ManagerTheaterRouter = router;