const express = require('express');
const router = express.Router();
import UserController from '../../controller/user';
import ErrorService from '../../service/error';
import AuthService from '../../service/auth';

// 更新使用者姓名
router.post('/info/update', AuthService.isAuth, ErrorService.handleErrorAsync(UserController.changeUserName));



export const CommonUserRouter = router;
