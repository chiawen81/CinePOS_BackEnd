"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonUserRouter = void 0;
const express = require('express');
const router = express.Router();
const upload_1 = __importDefault(require("../../../controller/common/upload"));
const user_1 = __importDefault(require("../../../controller/common/user"));
const error_1 = __importDefault(require("../../../service/error"));
const auth_1 = __importDefault(require("../../../service/auth"));
router.get('/profile/:staffId', auth_1.default.isEmpAuth, auth_1.default.isOwnerAuth, error_1.default.handleErrorAsync(user_1.default.getUserProfile));
router.post('/profile', auth_1.default.isEmpAuth, auth_1.default.isOwnerAuth, error_1.default.handleErrorAsync(user_1.default.changeUserName));
router.post('/sticker/:staffId', auth_1.default.isEmpAuth, auth_1.default.isOwnerAuth, upload_1.default.photoValidator, error_1.default.handleErrorAsync(upload_1.default.upload), error_1.default.handleErrorAsync(user_1.default.changeSticker));
exports.CommonUserRouter = router;
