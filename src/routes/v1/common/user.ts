const express = require('express');
const router = express.Router();
import UploadController from '../../../controller/common/upload';
import UserController from '../../../controller/common/user';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';
import multer from 'multer';
const multer = require('multer');

const fileValidator = multer({
    limits: {
        fileSize: 5 * 1024 * 1024,  // 5MB
    },
});

// 更新使用者姓名
router.post('/profile', AuthService.isAuth, ErrorService.handleErrorAsync(UserController.changeUserName));


// 更新大頭貼
router.post('/sticker', AuthService.isAuth, fileValidator.single('file'),
    UploadController.uploadSticker
);



export const CommonUserRouter = router;
