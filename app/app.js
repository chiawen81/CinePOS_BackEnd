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
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const user_1 = require("./routes/v1/common/user");
const login_1 = require("./routes/v1/common/login");
const option_1 = require("./routes/v1/common/option");
const upload_1 = require("./routes/v1/common/upload");
const chatGPT_1 = require("./routes/v1/common/chatGPT");
const timetable_1 = require("./routes/v1/manager/timetable");
const index_1 = require("./routes/v1/manager/index");
const movie_1 = require("./routes/v1/manager/movie");
const theater_1 = require("./routes/v1/manager/theater");
const dashboard_1 = require("./routes/v1/manager/dashboard");
const index_2 = require("./routes/v1/staff/index");
const ticketType_1 = require("./routes/v1/staff/ticketType");
const seat_1 = require("./routes/v1/staff/seat");
const schedule_1 = require("./routes/v1/staff/schedule");
const order_1 = require("./routes/v1/staff/order");
const ticket_1 = require("./routes/v1/staff/ticket");
require("./service/connection");
const error_1 = __importDefault(require("./service/error"));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/v1/common/option', option_1.CommonOptionRouter);
app.use('/v1/common/upload', upload_1.CommonUploadRouter);
app.use('/v1/common/chatGPT', chatGPT_1.ChatGPTRouter);
app.use('/v1/staff', index_2.StaffIndexRouter);
app.use('/v1/staff/user', user_1.CommonUserRouter);
app.use('/v1/staff/login', login_1.CommonLogInRouter);
app.use('/v1/staff/ticketType', ticketType_1.StaffTicketTypeRouter);
app.use('/v1/staff/ticket', ticket_1.StaffTicketRouter);
app.use('/v1/staff/seat', seat_1.StaffSeatRouter);
app.use('/v1/staff/schedule', schedule_1.StaffScheduleRouter);
app.use('/v1/staff/order', order_1.StaffOrderRouter);
app.use('/v1/manager/', index_1.ManagerIndexRouter);
app.use('/v1/manager/user', user_1.CommonUserRouter);
app.use('/v1/manager/login', login_1.CommonLogInRouter);
app.use('/v1/manager/timetable', timetable_1.TimetableIndexRouter);
app.use('/v1/manager/movie', movie_1.ManagerMovieRouter);
app.use('/v1/manager/theater', theater_1.ManagerTheaterRouter);
app.use('/v1/manager/dashboard', dashboard_1.ManagerDashboardRouter);
app.use(error_1.default.catchCustomError);
app.listen(process.env.LOCAL_PORT || 3005, () => {
    console.log(`Server is running on port ${process.env.PORT || 3005}`);
});
app.use('/v1/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/v1/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
});
