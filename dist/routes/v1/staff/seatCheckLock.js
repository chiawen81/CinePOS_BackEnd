"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffSeatCheckLockRouter = void 0;
const express = require('express');
const router = express.Router();
const ceatCheckLockController_1 = __importDefault(require("../../../controller/staff/ceatCheckLockController"));
const error_1 = __importDefault(require("../../../service/error"));
router.post('/', error_1.default.handleErrorAsync(ceatCheckLockController_1.default.seatCheckLock));
exports.StaffSeatCheckLockRouter = router;
