var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');




// 測試
const headers = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json'
};
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://fangchiawen:aass6688@cluster0.t7hdpfl.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("hotel").collection("rooms");
  // perform actions on the collection object
  app.get("/test7", async (req, res) => {
    let roomData = await collection.find({}).toArray();
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      message: "test work!",
      method: "get",
      roomData
    })
    );
    res.end();

  });
  client.close();
});

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



app.get("/test", (req, res) => {
  res.writeHead(200, headers);
  res.write(JSON.stringify({
    message: "test work!",
    method: "get",
  })
  );
  res.end();
});

app.get("/test2", (req, res) => {
  res.writeHead(200, headers);
  res.write(JSON.stringify({
    message: "test work!",
    method: "get",
    process_env: process.env,
  })
  );
  res.end();

});

app.get("/test3", (req, res) => {
  res.writeHead(200, headers);
  res.write(JSON.stringify({
    message: "test work!",
    method: "get",
    port: port,
    uri: uri,
  })
  );
  res.end();

});






app.get('/test4', (req, res) => {
  console.log('進1');

  MongoClient.connect(uri, (err, client) => {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      message: "MongoClient.connect成功",
      method: "get",
      client: client
    })
    );
    res.end();
  });
});

app.get('/test5', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(process.env.MONGODB_DBNAME_2);
    console.log('Connected to MongoDB Atlas');
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      message: "MongoClient.connect成功",
      method: "get",
      data: db
    })
    );
    res.end();
  } catch (err) {
    res.writeHead(500, headers);
    res.write(JSON.stringify({
      message: "失敗",
      method: "get",
      err: err
    })
    );
    res.end();
  }
});

app.get('/test6', (req, res) => {
  console.log('進1');

  MongoClient.connect(uri, (err, client) => {
    console.log('進2');
    cobsole.log()
    if (err) {
      res.writeHead(500, headers);
      res.write(JSON.stringify({
        "status": 500,
        "msg": "Failed to connect to MongoDB Atlas"
      }));
      res.end('client', client);
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
