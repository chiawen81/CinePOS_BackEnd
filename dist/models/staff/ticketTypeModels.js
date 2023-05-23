"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ticketTypeSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        required: [true, '票種名稱必填'],
    },
    price: {
        type: Number,
        required: [true, '票價必填'],
        min: 0
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
    collection: 'ticketTypes',
    versionKey: false
});
var TicketTypes = mongoose_1.default.model('ticketTypes', ticketTypeSchema);
exports.default = TicketTypes;
