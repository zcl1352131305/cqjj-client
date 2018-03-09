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
var logger = require("../../../lib/common").logger("wechatUser");

//ejs文件路径前缀
var ejsPrefix = 'wechat/merchant/';

//商户初始化，判断商户是否绑定后台账户
router.get('/init', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/wechat/auth" + "/MerchantOAuth2",
            qs: {
                code: req.query.code
            },
            method: 'GET'
        });
    }).then(function (data) {
        logger.error("----"+JSON.stringify(data));
        //微信已绑定后台账户，跳转到登陆页面去
        if(data.result.merchantAdminId != null && data.result.merchantAdminId != ''){
            res.render(ejsPrefix+"login",{
                id:data.result.id
            })
        }
        //微信未绑定后台账户，则跳转到绑定页面去
        else{

        }
    });
});

router.post('/login', function (req, res, next) {
    logger.error("==="+JSON.stringify(req.body))
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/wechat/auth/merchantLogin",
            body: req.body,
            method: 'POST',
            json:true
        });
    }).then(function (data) {
        logger.error(JSON.stringify(data))
    });
});



module.exports = router;
