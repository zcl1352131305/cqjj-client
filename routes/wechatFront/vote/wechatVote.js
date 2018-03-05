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
var logger = require("../../../lib/common").logger("wechatVote");

//ejs文件路径前缀
var ejsPrefix = 'wechatFront/vote/';

router.get('/init', function (req, res, next) {
    logger.error("start" + JSON.stringify(returnData));
    var returnData = {};
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/h/message/messageVote/selectList",
            method: 'GET'
        });
    }).then(function (data) {
        returnData.data = data.data;
        logger.error("abcdefg111112222aaaa" + JSON.stringify(returnData));
        res.render(ejsPrefix+"vote_list",returnData);
    });
});
/*router.get('/init', function (req, res, next) {
    var returnData = {};
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/m/wechat/auth" + "/OAuth2",
            qs: {
                code: req.query.code
            },
            method: 'GET'
        });
    }).then(function (data) {
        logger.error("11111" + JSON.stringify(data));
        returnData.userInfo = data.data;
        req.query.code = null;

        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/h/message/messageVote/selectList",
            method: 'GET'
        });
    }).then(function (data) {
        returnData.data = data.data;
        logger.error("abcdefg111112222aaaa" + JSON.stringify(returnData));
        res.render(ejsPrefix+"vote_list",returnData);
    });
});*/



router.get('/detail', function (req, res, next) {
    var returnData = {};
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH+"/h/message/messageVote/selectById",
            qs:req.query,
            method: 'GET'
        });
    }).then(function (data) {
        returnData = data;

        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH+"/h/message/messageVote/checkIsVote",
            qs:{
                voteId:returnData.data.id,
                uniqueFlag:req.query.uniqueFlag
            },
            method: 'GET'
        });

    }).then(function (data) {
        returnData.voteInfo = data.data;

        logger.error(JSON.stringify(returnData));

        res.render(ejsPrefix+"vote_detail",returnData);
    });
});

router.post('/submitVote', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH+"/h/message/messageVote/vote",
            method: 'POST',
            body:req.body,
            json:true
        });
    }).then(function (data) {
        console.log(JSON.stringify(data));
        res.json(data);
    });
});


module.exports = router;
