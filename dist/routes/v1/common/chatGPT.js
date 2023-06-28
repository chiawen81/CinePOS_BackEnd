"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGPTRouter = void 0;
const express = require('express');
const router = express.Router();
const error_1 = __importDefault(require("../../../service/error"));
const auth_1 = __importDefault(require("../../../service/auth"));
const chatGPT_1 = __importDefault(require("../../../controller/common/chatGPT"));
const response_1 = __importDefault(require("../../../service/response"));
router.get('/key', auth_1.default.isEmpAuth, response_1.default.setHeaderCROS, error_1.default.handleErrorAsync(chatGPT_1.default.getChatGPTKey));
exports.ChatGPTRouter = router;
