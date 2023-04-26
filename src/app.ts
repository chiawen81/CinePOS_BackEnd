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
import { StaffIndexRouter } from './routes/staff/index';
import { ManagerIndexRouter } from './routes/manager/index';
import { CommonUserRouter } from './routes/common/user';
import { CommonLogInRouter } from './routes/common/log-in';
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
app.use('/', StaffIndexRouter);
app.use('/user', CommonUserRouter);
app.use('/log-in', CommonLogInRouter);
// 後台
app.use('/admin/', ManagerIndexRouter);
app.use('/admin/user', CommonUserRouter);
app.use('/admin/log-in', CommonLogInRouter);



// ——————————  錯誤處理  —————————— 
app.use(ErrorService.catchCustomError);     // 自訂錯誤



// ——————————  其它設定  —————————— 
// 本機環境埠號設定
app.listen(process.env.LOCAL_PORT || 3005, () => {
  console.log(`Server is running on port ${process.env.PORT || 3005}`);
});

// ——————————  swagger  —————————— 
// 前台swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});