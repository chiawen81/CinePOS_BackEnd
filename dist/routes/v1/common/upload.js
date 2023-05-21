"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonUploadRouter = void 0;
const express = require('express');
const router = express.Router();
const upload_1 = __importDefault(require("../../../controller/common/upload"));
const error_1 = __importDefault(require("../../../service/error"));
const auth_1 = __importDefault(require("../../../service/auth"));
router.post('/', auth_1.default.isEmpAuth, upload_1.default.uploadValidator, error_1.default.handleErrorAsync(upload_1.default.upload), error_1.default.handleErrorAsync(upload_1.default.getUploadSuccessInfo));
router.delete('/', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(upload_1.default.deleteFile));
exports.CommonUploadRouter = router;
