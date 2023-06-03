"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const optionSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongodb_1.ObjectId,
        required: true,
        select: false
    },
    typeId: {
        type: Number,
        required: true,
        enum: [1, 2, 3],
        select: false
    },
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
});
var Option = mongoose_1.default.model('Option', optionSchema);
exports.default = Option;
