/**
 * Created by pc on 2017/2/10.
 */
var express = require('express');
var path = require('path')
var mongoose = require('mongoose')

var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session') //会话
var mongoStore = require('connect-mongo')(session)


var port = process.env.PORT || 3000;
var app = express(); // 启动一个服务
var dbUrl = 'mongodb://localhost/node'
//连接本地数据库
mongoose.connect(dbUrl)

app.set('views', './views/pages'); //指定视图的默认目录
app.set('view engine', 'jade');
//bodyParser后台录入将表单中的数据进行格式化
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
// express.static静态资源的获取
// path.join可以传多个参数将这些路径拼接起来
// __dirname当前路径
app.use(express.static(path.join(__dirname, 'public')))
app.locals.moment = require('moment')
app.use(cookieParser())
app.use(session({
  secret: 'imooc',
  resave: false,
  saveUninitialized: true,
  store: new mongoStore({ //创建数据库
    url: dbUrl, //数据库地址
    collection: 'sessions' // 表名
  })
}))

require('./config/routes')(app)

app.listen(port);
console.log('node started on port ' + port);


