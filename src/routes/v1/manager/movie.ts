const express = require('express');
const router = express.Router();
import MovieController from '../../../controller/manager/movie';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';
import ResponseService from '../../../service/response';
import ChatGPTController from '../../../controller/common/chatGPT';

// 查詢電影資訊列表
router.get('/list', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(MovieController.getList));

// 取得電影資訊
router.get('/:id', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(MovieController.getInfo));

// 新增電影資訊
router.post('/', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(MovieController.createInfo));

// 更新電影資訊
router.patch('/', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(MovieController.updateInfo));

// 刪除電影資訊
router.delete('/:id', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(MovieController.deleteMovie));

// 更新電影上映狀態
router.put('/status', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(MovieController.updateReleaseStatus));

// 取得chatGPT金鑰
router.get('/chatGPTKey', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(ChatGPTController.getChatGPTKey));


export const ManagerMovieRouter = router;