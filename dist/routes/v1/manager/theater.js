"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerTheaterRouter = void 0;
const express = require('express');
const router = express.Router();
const theater_1 = __importDefault(require("../../../controller/manager/theater"));
const error_1 = __importDefault(require("../../../service/error"));
const auth_1 = __importDefault(require("../../../service/auth"));
router.get('/list', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(theater_1.default.getTheaterList));
router.post('/', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(theater_1.default.createTheater));
router.get('/:theaterId', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(theater_1.default.getTheater));
router.patch('/:theaterId', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(theater_1.default.updateTheater));
router.delete('/:theaterId', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(theater_1.default.deleteTheater));
router.patch('/:theaterId/onoffline', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(theater_1.default.updateTheaterStatus));
router.post('/insertSeat', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(theater_1.default.insertSeat));
exports.ManagerTheaterRouter = router;