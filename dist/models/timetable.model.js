"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
const moviesModels_1 = __importDefault(require("./moviesModels"));
const theater_model_1 = __importDefault(require("./theater.model"));
const timetableSchema = new mongoose.Schema({
    movieId: { type: mongoose_1.Schema.Types.ObjectId, ref: moviesModels_1.default },
    theaterId: { type: mongoose_1.Schema.Types.ObjectId, ref: theater_model_1.default },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
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
}, {
    versionKey: false
});
const Timetable = mongoose.model('Timetable', timetableSchema);
exports.default = Timetable;
