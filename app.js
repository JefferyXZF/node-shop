var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// 引入路由文件
var indexRouter = require('./routes/index');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/public'));

//执行路由函数
indexRouter(app);

// catch 404 and forward to error handler
app.use('/', (req, res, next) =>{
    res.render('index', { title: 'Express' });
});

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//连接mongo数据库
mongoose.connect("mongodb://127.0.0.1:27017/xzfmall")
//连接成功connected
mongoose.connection.on("connected",function (argument) {
    console.log("连接数据库成功")
})
//连接失败error
mongoose.connection.on("error",function (argument) {
    console.log("连接数据库失败")
})
//连接断开disconnected
mongoose.connection.on("disconnected",function (argument) {
    console.log("连接数据库中断")
})
module.exports = app;
