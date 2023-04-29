const express = require('express');
const router = express.Router();
import UserController from '../../../controller/common/user';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';

// 更新使用者姓名
router.post('/profile', AuthService.isAuth, ErrorService.handleErrorAsync(UserController.changeUserName));



export const CommonUserRouter = router;
