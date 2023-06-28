"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonOptionRouter = void 0;
const express = require('express');
const router = express.Router();
const option_1 = __importDefault(require("../../../controller/common/option"));
const error_1 = __importDefault(require("../../../service/error"));
const auth_1 = __importDefault(require("../../../service/auth"));
const response_1 = __importDefault(require("../../../service/response"));
router.get('/:typeId', auth_1.default.isEmpAuth, response_1.default.setHeaderCROS, error_1.default.handleErrorAsync(option_1.default.getOptionData));
exports.CommonOptionRouter = router;
