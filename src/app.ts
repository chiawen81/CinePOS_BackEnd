// ——————————  引入相關服務  ——————————
// 套件
import cors from "cors";
import cookieParser from 'cookie-parser';
import logger from 'morgan';
const express = require('express');
const path = require('path');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// 路由模組
import { CommonUserRouter } from './routes/v1/common/user';
import { CommonLogInRouter } from './routes/v1/common/login';
import { CommonOptionRouter } from "./routes/v1/common/option";
import { CommonUploadRouter } from "./routes/v1/common/upload";
import { ChatGPTRouter } from "./routes/v1/common/chatGPT";
import { TimetableIndexRouter } from './routes/v1/manager/timetable';
import { ManagerMovieRouter } from "./routes/v1/manager/movie";
import { ManagerTheaterRouter } from "./routes/v1/manager/theater";
import { ManagerDashboardRouter } from "./routes/v1/manager/dashboard";
import { StaffIndexRouter } from './routes/v1/staff/index';
import { StaffTicketTypeRouter } from './routes/v1/staff/ticketType';
import { StaffSeatRouter } from './routes/v1/staff/seat';
import { StaffScheduleRouter } from './routes/v1/staff/schedule';
import { StaffOrderRouter } from "./routes/v1/staff/order";
import { StaffTicketRouter } from "./routes/v1/staff/ticket";

// 其它
import "./service/connection";                        // 資料庫設定
import ErrorService from './service/error';           // 錯誤處理 



// ——————————  middleware  ——————————
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// ——————————  設定路由  ——————————
// 共用
app.use('/v1/common/option', CommonOptionRouter);
app.use('/v1/common/upload', CommonUploadRouter);
app.use('/v1/common/chatGPT', ChatGPTRouter);

// 前台
app.use('/v1/staff', StaffIndexRouter);
app.use('/v1/staff/user', CommonUserRouter);
app.use('/v1/staff/login', CommonLogInRouter);
app.use('/v1/staff/ticketType', StaffTicketTypeRouter);
app.use('/v1/staff/ticket', StaffTicketRouter);
app.use('/v1/staff/seat', StaffSeatRouter);
app.use('/v1/staff/schedule', StaffScheduleRouter);
app.use('/v1/staff/order', StaffOrderRouter);

// 後台
app.use('/v1/manager/user', CommonUserRouter);
app.use('/v1/manager/login', CommonLogInRouter);
app.use('/v1/manager/timetable', TimetableIndexRouter);
app.use('/v1/manager/movie', ManagerMovieRouter);
app.use('/v1/manager/theater', ManagerTheaterRouter);
app.use('/v1/manager/dashboard', ManagerDashboardRouter)




// ——————————  錯誤處理  —————————— 
app.use(ErrorService.catchCustomError);     // 自訂錯誤



// ——————————  其它設定  —————————— 
// 本機環境埠號設定
app.listen(process.env.LOCAL_PORT || 3005, () => {
  console.log(`Server is running on port ${process.env.PORT || 3005}`);
});

// ——————————  swagger  —————————— 
app.use('/v1/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/v1/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});
