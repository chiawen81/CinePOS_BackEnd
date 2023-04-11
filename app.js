var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 測試
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI; // 從環境變數中取得MongoDB連線字串

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/test2', (req, res) => {
  console.log('進1');

  MongoClient.connect(uri, (err, client) => {
    console.log('進2');
    if (err) {
      res.writeHead(500, headers);
      res.write(JSON.stringify({
        "status": 500,
        "msg": "Failed to connect to MongoDB Atlas"
      }));
      res.end();
    } else {
      const db = client.db(process.env.MONGODB_DBNAME_2); // 從環境變數中取得資料庫名稱
      const rooms = db.collection('rooms');
      // const users = await db.collection('users');
      console.log('db', db);

      res.writeHead(200, headers);
      res.write(JSON.stringify({
        message: "test2 work!",
        method: "get",
        roomData: rooms,
      })
      );
      res.end();
    };

  });
});

app.get("/test", (req, res) => {
  const db = client.db(process.env.MONGODB_DBNAME_2);
  res.json({
    message: "test work!",
    method: "get",
    port: port,
    url: uri,
    db: db

  });
});

app.post("/test", (req, res) => {
  res.json({
    message: "test work!",
    method: "post"
  });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Express Server started on port ${port}`);
});

module.exports = app;
