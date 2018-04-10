/**
 * 商户登陆注册初始化以及绑定
 * Created by Administrator on 2017/9/20 0020.
 */
var express = require('express');
var router = require('express-promise-router')();
var cRequest = require("../../../lib/customRequest");
var common = require("../../../lib/common");
var constant = require("../../../constant");
var Promise = require("bluebird");
var logger = require("../../../lib/common").logger("wechatUser");

//ejs文件路径前缀
var ejsPrefix = 'wechat/user/';


router.post('/furniture/add', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/collections/furniture/add",
            body: req.body,
            method: 'POST',
            json:true
        });
    }).then(function (data) {
        res.json(data);
    });

});

router.get('/furniture/remove', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/collections/furniture/remove/"+ req.query.id,
            method: 'delete',
        });
    }).then(function (data) {
        res.json(data);
    });

});


router.get('/furniture/toCollection', function (req, res, next) {
    res.render(ejsPrefix+"furniture_collection_list");
});

router.get('/furniture/list', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/collections/furniture/list/"+req.query.userId,
            method: 'get',
        });
    }).then(function (data) {
        logger.error('+++++'+JSON.stringify(data))
        res.json(data);
    });
});


module.exports = router;
