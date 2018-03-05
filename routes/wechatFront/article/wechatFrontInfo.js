/**
 * 微信推送
 * Created by Administrator on 2017/9/20 0020.
 */
var express = require('express');
var router = require('express-promise-router')();
var cRequest = require("../../../lib/customRequest");
var common = require("../../../lib/common");
var constant = require("../../../constant");
var Promise = require("bluebird");
var logger = require("../../../lib/common").logger("wechatMenu");

//ejs文件路径前缀
var ejsPrefix = 'wechatFront/article/';

router.get('/articlePush', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH+"/h/message/messageInfo/selectById",
            qs:req.query,
            method: 'GET'
        });
    }).then(function (data) {
        console.log(JSON.stringify(data));
        res.render(ejsPrefix+"messageInfo_push",data);
    });
});

/**
 * 资讯信息
 */
router.get('/articleInfo', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH+"/h/message/messageInfo/selectById",
            qs:req.query,
            method: 'GET'
        });
    }).then(function (data) {
        console.log(JSON.stringify(data));
        var showDate = req.query.showDate;
        if(null == showDate || showDate == ""){
            showDate = "1";
        }
        data.showDate = showDate;
        res.render(ejsPrefix+"messageInfo",data);
    });
});

/**
 * 场馆
 */
router.get('/venuesInfo', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH+"/h/message/messageInfo/selectById",
            qs:req.query,
            method: 'GET'
        });
    }).then(function (data) {
        logger.error(JSON.stringify(data));
        res.render("wechatFront/venues/venuesInfo",data);
    });
});


router.get('/articleHistory', function (req, res, next) {
    res.render(ejsPrefix+"messageHistory",{});
});


module.exports = router;
