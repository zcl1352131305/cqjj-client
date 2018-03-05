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
var logger = require("../../../lib/common").logger("wechatActivity");

//ejs文件路径前缀
var ejsPrefix = 'wechatFront/activity/';

router.get('/init', function (req, res, next) {
    logger.error("start" + JSON.stringify(returnData));
    var returnData = {};
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/h/message/messageRegistration/selectList",
            method: 'GET'
        });
    }).then(function (data) {
        logger.error(JSON.stringify(data));
        res.render(ejsPrefix+"activity_list",data);
    });
});


router.get('/detail', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH+"/h/message/messageRegistration/selectById",
            qs:req.query,
            method: 'GET'
        });
    }).then(function (data) {
        var now = new Date();
        var begin = new Date(data.data.startTime.substring(0,19));
        var end = new Date(data.data.endTime.substring(0,19));
        if(now < begin){
            data.enrolFlag = 1;
        }
        else if(now > end){
            data.enrolFlag = 2;
        }
        else if(parseInt(data.data.enrolNum) > parseInt(data.data.number)){
            data.enrolFlag = 3;
        }
        else{
            data.enrolFlag = 4;
        }

        logger.error(JSON.stringify(data));
        res.render(ejsPrefix+"activity_detail",data);

    });
});

router.get('/enrolEdit', function (req, res, next) {
    var returnData = {};
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH+"/h/message/messageRegistration/selectById",
            qs:req.query,
            method: 'GET'
        });
    }).then(function (data) {
        returnData = data;
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH+"/h/wechat/wechatPublicPlatform/selectList",
            qs:{
                type:"fwh"
            },
            method: 'GET'
        });
    }).then(function(data){
        returnData.wechatInfo = data.data;


        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH+"/h/message/messageRegistrationEnrol/selectList",
            qs:{
                activityId:req.query.id,
                openId:req.query.openId,
                note:"isValidate"
            },
            method: 'GET'
        });


    }).then(function(data){
        returnData.enrolInfo = data.data;
        logger.error(JSON.stringify(returnData));
        res.render(ejsPrefix+"activity_enrol",returnData);
    });
});

router.get('/enrolCheck', function (req, res, next) {
    return Promise.try(function () {
        req.query.note = "isValidate";
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH+"/h/message/messageRegistrationEnrol/selectList",
            qs:req.query,
            method: 'GET'
        });
    }).then(function (data) {
        res.json(data);

    });
});

/**
 * 提交报名带支付
 */
router.post('/saveEnrolWithPay', function (req, res, next) {
    var returnData = {};
    return Promise.try(function () {
        //微信下单
        var ip = getClientIp(req);
        logger.error("+======"+ip);
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH+"/h/wechat/wechatPay/pay",
            method: 'POST',
            body:{
                orderNo:req.body.id,
                fee:req.body.needPay,
                openId:req.body.openId,
                ip:getClientIp(req),
                notifyURL:constant.SYSTEM_INDEX+"/h/wechat/wechatPay/payResult",
                nowUrl:constant.SYSTEM_INDEX+"/wechatFront/wechatActivity/"
            },
            json:true
        });


    }).then(function (data) {
        logger.debug(JSON.stringify(data));
        returnData = data;
        //支付ID，下单成功后获得
        req.body.prepayId = data.data.orderResult.prepayId;
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH+"/h/message/messageRegistrationEnrol/add",
            method: 'POST',
            body:req.body,
            json:true
        });

    }).then(function(data){
        logger.debug("--"+JSON.stringify(data));

        res.json(returnData);
    });
});

/**
 * 提交报名不带支付
 */
router.post('/saveEnrol', function (req, res, next) {
    var returnData = {};
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH+"/h/message/messageRegistrationEnrol/add",
            method: 'POST',
            body:req.body,
            json:true
        });
    }).then(function (data) {
        logger.debug("--"+JSON.stringify(data));

        res.json(data);
    });
});

/**
 * 支付结果回调
 */
router.post('/payResult', function (req, res, next) {
    logger.error("支付成功回掉！！！！！！！！！！！！！！！！");
    logger.error(JSON.stringify(req.body));
});


function getClientIp(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0]
    }
    return ip;
}

module.exports = router;
