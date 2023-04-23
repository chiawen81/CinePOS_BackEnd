"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose_1.default.connect(process.env.DATABASE, options).then(() => {
    console.log('MongoDB Atlas connected');
}).catch(err => {
    console.log('MongoDB Atlas connection error:', err);
});
