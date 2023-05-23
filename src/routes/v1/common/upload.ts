const express = require('express');
const router = express.Router();
import UploadController from '../../../controller/common/upload';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';


// 上傳檔案
router.post('/', AuthService.isEmpAuth, UploadController.uploadValidator,              // 共用- 驗證上傳檔案
    ErrorService.handleErrorAsync(UploadController.upload),                            // 共用- 上傳檔案
    ErrorService.handleErrorAsync(UploadController.getUploadSuccessInfo),              // 共用- 取得上傳成功的通用檔案資訊
);


// 刪除檔案  
router.delete('/', AuthService.isEmpAuth,
    ErrorService.handleErrorAsync(UploadController.deleteFile),                        // 共用- 刪除檔案
);



export const CommonUploadRouter = router;