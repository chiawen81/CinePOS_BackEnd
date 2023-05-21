const express = require('express');
const router = express.Router();
import MovieController from '../../../controller/manager/movie';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';

// 查詢電影資訊列表
router.get('/list', AuthService.isEmpAuth, ErrorService.handleErrorAsync(MovieController.getList));

// 取得電影資訊
router.get('/:id', AuthService.isEmpAuth, ErrorService.handleErrorAsync(MovieController.getInfo));

// 新增電影資訊
router.post('/', AuthService.isEmpAuth, ErrorService.handleErrorAsync(MovieController.createInfo));

// 更新電影資訊
router.patch('/', AuthService.isEmpAuth, ErrorService.handleErrorAsync(MovieController.updateInfo));



export const ManagerMovieRouter = router;