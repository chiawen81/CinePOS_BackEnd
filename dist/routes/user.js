"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express = require('express');
const router = express.Router();
const error_1 = __importDefault(require("../service/error"));
const user_1 = __importDefault(require("../controller/user"));
router.post('/info/update', error_1.default.handleErrorAsync(user_1.default.changeUserName));
exports.userRouter = router;
