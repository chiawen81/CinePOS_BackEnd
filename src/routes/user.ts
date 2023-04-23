const express = require('express');
const router = express.Router();
import ErrorService from '../service/error';
import UserController from '../controller/user';

// 更新使用者姓名
router.post('/info/update', ErrorService.handleErrorAsync(UserController.changeUserName));



export const userRouter = router;
