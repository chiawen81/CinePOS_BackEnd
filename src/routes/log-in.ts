const express = require('express');
const router = express.Router();
import ErrorService from '../service/error';
import LogInController from '../controller/log-in';

// 登入
router.post('/', ErrorService.handleErrorAsync(LogInController.lonIn));



export const logInRouter = router;