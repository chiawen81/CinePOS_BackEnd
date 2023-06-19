const express = require('express');
const router = express.Router();
import ErrorService from '../../../service/error';
import AuthService from '../../../service/auth';
import ChatGPTController from '../../../controller/common/chatGPT';


// 取得chatGPT金鑰
router.get('/key', AuthService.isEmpAuth, ErrorService.handleErrorAsync(ChatGPTController.getChatGPTKey));

export const ChatGPTRouter = router;