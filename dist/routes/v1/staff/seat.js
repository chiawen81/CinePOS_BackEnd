"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffSeatRouter = void 0;
const express = require('express');
const router = express.Router();
const seat_controller_1 = __importDefault(require("../../../controller/staff/seat.controller"));
const error_1 = __importDefault(require("../../../service/error"));
const auth_1 = __importDefault(require("../../../service/auth"));
router.post('/checkLock', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(seat_controller_1.default.seatCheckLock));
router.get('/:scheduleId', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(seat_controller_1.default.getScheduleIdSeat));
exports.StaffSeatRouter = router;
