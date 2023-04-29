const express = require('express');
const router = express.Router();
import LogInController from '../../../controller/common/login';
import ErrorService from '../../../service/error';

// 登入
router.post('/', ErrorService.handleErrorAsync(LogInController.logIn));



export const CommonLogInRouter = router;