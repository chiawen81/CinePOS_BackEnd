"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
const moviesModels_1 = __importDefault(require("../manager/moviesModels"));
const seats_model_1 = __importDefault(require("../common/seats.model"));
const ticketsSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: false
    },
    movieId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: moviesModels_1.default,
        required: [true, '電影ID必填'],
    },
    seatId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: seats_model_1.default,
        required: [true, '座位ID必填'],
    },
    price: {
        type: Number,
        required: [true, '票價必填'],
    },
    paymentMethod: {
        type: Number,
        required: [true, '付款方法必填'],
    },
    isRefund: {
        type: Boolean,
        required: [true, '是否退票必填'],
    },
    refundMethod: {
        type: Number,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        select: false,
    }
}, {
    collection: 'tickets',
    versionKey: false
});
const Ticket = mongoose.model('Ticket', ticketsSchema);
exports.default = Ticket;
