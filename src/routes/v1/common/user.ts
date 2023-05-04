const express = require('express');
const router = express.Router();
import UploadController from '../../../controller/common/upload';
import UserController from '../../../controller/common/user';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';

// 更新使用者姓名
router.post('/profile', AuthService.isAuth, ErrorService.handleErrorAsync(UserController.changeUserName));


// 更新大頭貼
router.post('/sticker', AuthService.isAuth, UploadController.photoValidator,
    UploadController.upload(                                                        // 共用- 上傳檔案
        UserController.changeSticker                                                // 自訂- 更新資料庫大頭貼連結
    )
);



export const CommonUserRouter = router;
