const express = require('express');
const router = express.Router();
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';
import ChatGPTController from '../../../controller/common/chatGPT';
import ResponseService from '../../../service/response';


// 取得chatGPT金鑰
router.get('/key', AuthService.isEmpAuth, ResponseService.setHeaderCROS, ErrorService.handleErrorAsync(ChatGPTController.getChatGPTKey));

export const ChatGPTRouter = router;