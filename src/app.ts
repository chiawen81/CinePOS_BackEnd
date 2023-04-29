// ——————————  引入相關服務  ——————————
// 套件
import cors from "cors";
import cookieParser from 'cookie-parser';
import logger from 'morgan';
const express = require('express');
const path = require('path');
const app = express();
// 路由模組
import { StaffIndexRouter } from './routes/v1/staff/index';
import { ManagerIndexRouter } from './routes/v1/manager/index';
import { CommonUserRouter } from './routes/v1/common/user';
import { CommonLogInRouter } from './routes/v1/common/login';
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
// 前台
app.use('/v1/staff', StaffIndexRouter);
app.use('/v1/staff/user', CommonUserRouter);
app.use('/v1/staff/login', CommonLogInRouter);
// 後台
app.use('/v1/manager/', ManagerIndexRouter);
app.use('/v1/manager/user', CommonUserRouter);
app.use('/v1/manager/login', CommonLogInRouter);



// ——————————  錯誤處理  —————————— 
app.use(ErrorService.catchCustomError);     // 自訂錯誤



// ——————————  其它設定  —————————— 
// 本機環境埠號設定
app.listen(process.env.LOCAL_PORT || 3005, () => {
  console.log(`Server is running on port ${process.env.PORT || 3005}`);
});
