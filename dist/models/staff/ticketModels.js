"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const orderModels_1 = __importDefault(require("./orderModels"));
const moviesModels_1 = __importDefault(require("../manager/moviesModels"));
const seats_model_1 = __importDefault(require("../common/seats.model"));
const ticketsSchema = new mongoose_1.default.Schema({
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: orderModels_1.default,
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
        type: String,
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
const Ticket = mongoose_1.default.model('Ticket', ticketsSchema);
exports.default = Ticket;
