"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express = require('express');
const path = require('path');
const app = express();
const index_1 = require("./routes/index");
const users_1 = require("./routes/users");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index_1.indexRouter);
app.use('/user', users_1.usersRouter);
const uri = "mongodb+srv://fangchiawen:aass6688@cluster0.t7hdpfl.mongodb.net/hotel?retryWrites=true&w=majority";
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose_1.default.connect(uri, options).then(() => {
    console.log('MongoDB Atlas connected');
}).catch(err => {
    console.log('MongoDB Atlas connection error:', err);
});
app.listen(process.env.PORT || 3005, () => {
    console.log(`Server is running on port ${process.env.PORT || 3005}`);
});
