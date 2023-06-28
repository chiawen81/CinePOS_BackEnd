const express = require('express');
const router = express.Router();
import LogInController from '../../../controller/common/login';
import ErrorService from '../../../service/error';
import ResponseService from '../../../service/response';

// 登入
router.post('/', ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(LogInController.logIn));



export const CommonLogInRouter = router;