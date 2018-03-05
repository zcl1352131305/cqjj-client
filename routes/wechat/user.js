/**
 * 微信推送
 * Created by Administrator on 2017/9/20 0020.
 */
var express = require('express');
var router = require('express-promise-router')();
var cRequest = require("../../lib/customRequest");
var common = require("../../lib/common");
var constant = require("../../constant");
var Promise = require("bluebird");
var logger = require("../../lib/common").logger("wechatUser");

//ejs文件路径前缀
var ejsPrefix = 'wechat/user/';


router.get('/furnitureRecycle', function (req, res, next) {
    res.render(ejsPrefix+"furniture_recycle");
});



module.exports = router;
