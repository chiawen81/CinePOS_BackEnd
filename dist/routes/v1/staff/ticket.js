"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffTicketRouter = void 0;
const express = require('express');
const router = express.Router();
const ticket_controller_1 = __importDefault(require("../../../controller/staff/ticket.controller"));
const error_1 = __importDefault(require("../../../service/error"));
const auth_1 = __importDefault(require("../../../service/auth"));
router.post('/', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(ticket_controller_1.default.createTicket));
exports.StaffTicketRouter = router;
