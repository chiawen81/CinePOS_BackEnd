"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimetableIndexRouter = void 0;
const error_1 = __importDefault(require("../../../service/error"));
const timetable_1 = __importDefault(require("../../../controller/common/timetable"));
const response_1 = __importDefault(require("../../../service/response"));
const express = require('express');
const router = express.Router();
router.get('/list', response_1.default.setHeaderCROS, error_1.default.handleErrorAsync(timetable_1.default.getList));
router.post('/create', response_1.default.setHeaderCROS, error_1.default.handleErrorAsync(timetable_1.default.create));
router.patch('/update', response_1.default.setHeaderCROS, error_1.default.handleErrorAsync(timetable_1.default.update));
router.delete('/:timetableId', response_1.default.setHeaderCROS, error_1.default.handleErrorAsync(timetable_1.default.delete));
router.options('*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).end();
}));
router.all('*', (req, res) => {
    res.status(404).json({
        "status": "false",
        "message": "無此網站路由",
    });
});
exports.TimetableIndexRouter = router;
