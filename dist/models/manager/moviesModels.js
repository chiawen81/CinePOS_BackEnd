"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const moviesSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    enTitle: {
        type: String,
        required: false,
    },
    genre: {
        type: [{
                type: Number,
                enum: [1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11, 12]
            }],
        required: true
    },
    genreName: {
        type: [{
                type: String
            }],
        required: false
    },
    runtime: {
        type: Number,
        required: true,
        min: 60,
        max: 240,
    },
    provideVersion: {
        type: [{
                type: Number
            }],
        required: true
    },
    provideVersionName: {
        type: [{
                type: String
            }],
        required: false
    },
    rate: {
        type: Number,
        enum: [0, 6, 12, 15, 18],
        required: true
    },
    rateName: {
        type: String,
        required: false
    },
    director: {
        type: String,
        required: false,
    },
    cast: {
        type: [{
                type: String
            }],
        required: false,
    },
    description: {
        type: String,
        required: false,
        minlength: 10
    },
    status: {
        type: Number,
        enum: [-1, 0, 1],
        required: true
    },
    statusName: {
        type: String,
        required: false
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    trailerLink: {
        type: String,
        required: false,
        match: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/i
    },
    distributor: {
        type: String,
        required: false,
    },
    posterUrl: {
        type: String,
        required: true,
        match: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/i
    },
    createdAt: {
        type: Date,
        required: false,
        select: false,
    },
    updatedAt: {
        type: Date,
        required: false,
        select: false,
    }
}, {
    collection: 'movies',
    versionKey: false
});
const Movie = mongoose_1.default.model('Movie', moviesSchema);
exports.default = Movie;
