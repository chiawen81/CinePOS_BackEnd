"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonLogInRouter = void 0;
const express = require('express');
const router = express.Router();
const login_1 = __importDefault(require("../../../controller/common/login"));
const error_1 = __importDefault(require("../../../service/error"));
const response_1 = __importDefault(require("../../../service/response"));
router.post('/', response_1.default.setHeaderCROS, error_1.default.handleErrorAsync(login_1.default.logIn));
exports.CommonLogInRouter = router;
