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
const databaseUrl = (process.env.NODE_ENV === 'production') ? process.env.DATABASE_REMOTE : process.env.DATABASE_LOCAL;
mongoose_1.default.connect(databaseUrl, options).then(() => {
    console.log(`MongoDB connected: ${databaseUrl}`);
}).catch(err => {
    console.log(`ERROR connecting to MongoDB: ${databaseUrl}`, err);
});
