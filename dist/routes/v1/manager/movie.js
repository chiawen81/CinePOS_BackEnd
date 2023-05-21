"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerMovieRouter = void 0;
const express = require('express');
const router = express.Router();
const movie_1 = __importDefault(require("../../../controller/manager/movie"));
const error_1 = __importDefault(require("../../../service/error"));
const auth_1 = __importDefault(require("../../../service/auth"));
router.get('/list', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(movie_1.default.getList));
router.get('/:id', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(movie_1.default.getInfo));
router.post('/', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(movie_1.default.createInfo));
router.patch('/', auth_1.default.isEmpAuth, error_1.default.handleErrorAsync(movie_1.default.updateInfo));
exports.ManagerMovieRouter = router;
