"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const timetableSchema = new mongoose.Schema({
    theaterId: { type: mongoose.Schema.ObjectId, ref: 'theaters' },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
const Timetable = mongoose.model('Timetable', timetableSchema);
exports.default = Timetable;
