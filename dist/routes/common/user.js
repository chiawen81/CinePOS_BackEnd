"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonUserRouter = void 0;
const express = require('express');
const router = express.Router();
const user_1 = __importDefault(require("../../controller/user"));
const error_1 = __importDefault(require("../../service/error"));
const auth_1 = __importDefault(require("../../service/auth"));
router.post('/info/update', auth_1.default.isAuth, error_1.default.handleErrorAsync(user_1.default.changeUserName));
exports.CommonUserRouter = router;
