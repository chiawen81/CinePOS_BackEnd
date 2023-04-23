"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInRouter = void 0;
const express = require('express');
const router = express.Router();
const error_1 = __importDefault(require("../service/error"));
const log_in_1 = __importDefault(require("../controller/log-in"));
router.post('/', error_1.default.handleErrorAsync(log_in_1.default.lonIn));
exports.logInRouter = router;
