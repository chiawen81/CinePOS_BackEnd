// 引入的套件
import cors from "cors";
import cookieParser from 'cookie-parser';
import logger from 'morgan';
const express = require('express');
const path = require('path');
const app = express();

// 引入錯誤處理模組
import ErrorService from './service/error';

// 引入路由模組
import { indexRouter } from './routes/index';
import { userRouter } from './routes/user';
import { logInRouter } from './routes/log-in';

// 資料庫設定開始
import "./service/connection";

// 設定 middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 設定路由
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/log-in', logInRouter);

// 設定錯誤處理
app.use(ErrorService.catchCustomError); // 自訂錯誤

// 本機環境埠號設定
app.listen(process.env.LOCAL_PORT || 3005, () => {
  console.log(`Server is running on port ${process.env.PORT || 3005}`);
});
