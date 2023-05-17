"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffTicketTypeRouter = void 0;
const express = require('express');
const router = express.Router();
const ticketTypeController_1 = __importDefault(require("../../../controller/staff/ticketTypeController"));
const error_1 = __importDefault(require("../../../service/error"));
const auth_1 = __importDefault(require("../../../service/auth"));
router.get('/', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(ticketTypeController_1.default.getTicketType));
router.post('/', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(ticketTypeController_1.default.createTicketType));
exports.StaffTicketTypeRouter = router;
