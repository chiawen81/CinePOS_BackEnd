// 設定引入的套件
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// 共用的headers
const headers = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json'
};

// 引入路由模組
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

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


app.use('/', indexRouter);
app.use('/user', usersRouter);

const uri = "mongodb+srv://fangchiawen:aass6688@cluster0.t7hdpfl.mongodb.net/hotel?retryWrites=true&w=majority";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(uri, options).then(() => {
  console.log('MongoDB Atlas connected');
}).catch(err => {
  console.log('MongoDB Atlas connection error:', err);
});


app.listen(process.env.PORT || 3005, () => {
  console.log(`Server is running on port ${process.env.PORT || 3005}`);
});
