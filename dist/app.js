"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express = require('express');
const path = require('path');
const app = express();
const error_1 = __importDefault(require("./service/error"));
const index_1 = require("./routes/index");
const user_1 = require("./routes/user");
const log_in_1 = require("./routes/log-in");
require("./service/connection");
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index_1.indexRouter);
app.use('/user', user_1.userRouter);
app.use('/log-in', log_in_1.logInRouter);
app.use(error_1.default.catchCustomError);
app.listen(process.env.LOCAL_PORT || 3005, () => {
    console.log(`Server is running on port ${process.env.PORT || 3005}`);
});
