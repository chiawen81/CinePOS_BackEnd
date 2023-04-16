// 設定引入的套件
import cors from "cors";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
const express = require('express');
const path = require('path');
const app = express();

// 引入路由模組
import { indexRouter } from './routes/index';
import { usersRouter } from './routes/users';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 設定 middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 僅入路由
app.use('/', indexRouter);
app.use('/user', usersRouter);

const uri = "mongodb+srv://fangchiawen:aass6688@cluster0.t7hdpfl.mongodb.net/hotel?retryWrites=true&w=majority";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(uri, options as any).then(() => {
  console.log('MongoDB Atlas connected');
}).catch(err => {
  console.log('MongoDB Atlas connection error:', err);
});


app.listen(process.env.PORT || 3005, () => {
  console.log(`Server is running on port ${process.env.PORT || 3005}`);
});
