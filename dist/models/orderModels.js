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
const moviesModels_1 = __importDefault(require("./moviesModels"));
const timetable_model_1 = __importDefault(require("./timetable.model"));
const seats_model_1 = __importDefault(require("./seats.model"));
const ticketModels_1 = __importDefault(require("./ticketModels"));
const ticketTypeModels_1 = __importDefault(require("./ticketTypeModels"));
const ordersSchema = new mongoose_1.default.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    ticketList: [{
            ticketId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: ticketModels_1.default,
                required: [true, '票券編號必填'],
            },
            seatId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: seats_model_1.default,
                required: [true, '場次座位ID必填'],
            },
            movieId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: moviesModels_1.default,
                required: [true, '電影ID必填'],
            },
            scheduleId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: timetable_model_1.default,
                required: [true, '場次ID必填2'],
            },
            price: {
                type: Number,
                required: [true, '票券價格必填'],
            },
            ticketTypeId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: ticketTypeModels_1.default,
                required: [true, '票券類型ID必填'],
            }
        }],
    paymentMethod: {
        type: Number,
        required: [true, '付款方法必填'],
        enum: [1, 2],
    },
    amount: {
        type: Number,
        required: [true, '訂單總金額必填'],
    },
    status: {
        type: Number,
        required: [true, '訂單狀態必填'],
        enum: [-1, 0, 1, 2, 3],
        default: 0
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
    collection: 'orders',
    versionKey: false
});
const Order = mongoose_1.default.model('Order', ordersSchema);
exports.default = Order;
