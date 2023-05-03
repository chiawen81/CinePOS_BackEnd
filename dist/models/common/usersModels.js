"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    newName: {
        type: String,
        required: false,
    },
    staffId: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    resetKey: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: false
    },
    status: {
        type: Number,
        required: false
    },
    createdAt: {
        type: String,
        required: false
    },
    stickerUrl: {
        type: String,
        required: false
    },
    stickerFileName: {
        type: String,
        required: false
    },
});
var User = mongoose_1.default.model('User', userSchema);
exports.default = User;
