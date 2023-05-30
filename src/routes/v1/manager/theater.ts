const express = require('express');
const router = express.Router();
import TheaterController from '../../../controller/manager/theater';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';

// 查詢影廳列表
router.get('/list', AuthService.isEmpAuth, ErrorService.handleErrorAsync(TheaterController.getTheaterList));

// 新增影廳
router.post('/', AuthService.isEmpAuth, ErrorService.handleErrorAsync(TheaterController.createTheater));

// 查詢影廳
router.get('/:theaterId', AuthService.isEmpAuth, ErrorService.handleErrorAsync(TheaterController.getTheater));

// 編輯影廳
router.patch('/:theaterId', AuthService.isEmpAuth, ErrorService.handleErrorAsync(TheaterController.updateTheater));

// 刪除影廳
router.delete('/:theaterId', AuthService.isEmpAuth, ErrorService.handleErrorAsync(TheaterController.deleteTheater));

export const ManagerTheaterRouter = router;