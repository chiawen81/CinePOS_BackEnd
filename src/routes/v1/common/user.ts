const express = require('express');
const router = express.Router();
// import UploadController from '../../../controller/common/upload';
import UserController from '../../../controller/common/user';

import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';

// 更新使用者姓名
router.post('/profile', AuthService.isAuth, ErrorService.handleErrorAsync(UserController.changeUserName));

// 更新大頭貼
// router.post('/sticker', AuthService.isAuth, ErrorService.handleErrorAsync(UploadController.uploadSticker));



export const CommonUserRouter = router;
