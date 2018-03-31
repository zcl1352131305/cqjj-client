var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cluster = require('cluster');
var log4js = require('log4js');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
var url = require('url');
var constant = require('./constant');
var moment = require('moment');
var Promise = require("bluebird");
var cRequest = require("./lib/customRequest");
log4js.configure({
    appenders: [
        { type: 'console' },{
            type: 'file',
            filename: 'logs/access.log',
            maxLogSize: 1024,
            backups:2,
            category: 'normal'
        }
    ],
    replaceConsole: true
});
var logger = require("./lib/common").logger('normal');
var app = express()


//微信用户端
var wechatIndex = require('./routes/wechat/index');
var qiniu = require('./routes/qiniu');

var userHome = require('./routes/wechat/user/home');
var userRecycle = require('./routes/wechat/user/recycle');
var userFurniture = require('./routes/wechat/user/furniture');

var merchantHome = require('./routes/wechat/merchant/home');
var merchantCertification = require('./routes/wechat/merchant/certification');
var merchantRecycle = require('./routes/wechat/merchant/recycle');
var merchantSale =  require('./routes/wechat/merchant/sale');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(log4js.connectLogger(logger));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static( path.join(__dirname, 'public')));



//微信服务号
app.use("/wechat/index", wechatIndex);
app.use("/wechat/user/recycle", userRecycle);
app.use("/wechat/user/home", userHome);
app.use("/wechat/user/furniture", userFurniture);

app.use("/wechat/merchant/home", merchantHome);
app.use("/wechat/merchant/certification", merchantCertification);
app.use("/wechat/merchant/recycle", merchantRecycle);
app.use("/wechat/merchant/sale", merchantSale);
app.use("/qiniu", qiniu);



//反向代理 所有在/proxy/下的路由将被拦截0
app.use('/cqjjTrade/wechat/portal/**', function (req, res) {
    var pathname = url.parse(req.originalUrl).pathname;
    logger.debug(constant.BASE_PATH+ pathname);
    proxy.web(req, res, { target: constant.BASE_PATH+ pathname });
});

/*app.use('/upload/!**', function (req, res) {
    var pathname = url.parse(req.originalUrl).pathname;
    logger.debug(constant.BASE_PATH+ pathname);
    proxy.web(req, res, { target: constant.BASE_PATH+ pathname });
});


//反向代理 所有在/upload/下的路由将被拦截
app.use('/h/wechat/wechatPay/payResult', function (req, res) {
    var pathname = url.parse(req.originalUrl).pathname;
    logger.debug(constant.BASE_PATH+ pathname);
    proxy.web(req, res, { target: constant.BASE_PATH+ pathname });
});
////////////////////*/


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log("404 error");
    var err = new Error('Not Found');
    err.status = 404;
    res.status(404);
    res.render("error/404",{});
    //next(err);
});

//数据格式化
app.locals.myDateFormat = function(date){
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
};



module.exports = app;

