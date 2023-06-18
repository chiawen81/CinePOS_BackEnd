"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerDashboardRouter = void 0;
const express = require('express');
const router = express.Router();
const dashboard_1 = __importDefault(require("../../../controller/manager/dashboard"));
const error_1 = __importDefault(require("../../../service/error"));
const auth_1 = __importDefault(require("../../../service/auth"));
router.get('/metric', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(dashboard_1.default.getMetric));
router.get('/boxOffice', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(dashboard_1.default.getBoxOfficeStatistics));
exports.ManagerDashboardRouter = router;
