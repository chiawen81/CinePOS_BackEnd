const express = require('express');
const router = express.Router();
import OptionController from '../../../controller/common/option';
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';

// 取得選項
router.get('/:typeId', AuthService.isEmpAuth, ErrorService.handleErrorAsync(OptionController.getOptionData));



export const CommonOptionRouter = router;