"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffScheduleRouter = void 0;
const express = require('express');
const router = express.Router();
const schedule_controller_1 = __importDefault(require("../../../controller/staff/schedule.controller"));
const error_1 = __importDefault(require("../../../service/error"));
const auth_1 = __importDefault(require("../../../service/auth"));
router.get('/list', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(schedule_controller_1.default.getScheduleList));
exports.StaffScheduleRouter = router;
