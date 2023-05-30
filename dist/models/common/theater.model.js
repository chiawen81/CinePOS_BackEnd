"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const mongoose_1 = require("mongoose");
const theaterSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    floor: {
        type: Number,
        default: null
    },
    type: Number,
    totalCapacity: {
        type: Number,
        required: true
    },
    wheelChairCapacity: {
        type: Number,
        default: 0
    },
    row: {
        type: Number,
        required: true
    },
    col: {
        type: Number,
        required: true
    },
    rowLabel: {
        type: [String],
        default: []
    },
    colLabel: {
        type: [String],
        default: []
    },
    seatMap: {
        type: [String],
        required: true,
    },
    status: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });
const theaters = mongoose.model('theaters', theaterSchema);
exports.default = theaters;
