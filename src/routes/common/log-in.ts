const express = require('express');
const router = express.Router();
import LogInController from '../../controller/log-in';
import ErrorService from '../../service/error';

// 登入
router.post('/', ErrorService.handleErrorAsync(LogInController.lonIn));



export const CommonLogInRouter = router;