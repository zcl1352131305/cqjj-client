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
var ejsPrefix = 'wechat/merchant/';


//商户初始化，判断商户是否绑定后台账户
router.get('/init', function (req, res, next) {
    if(null != req.query.code && req.query.code != ''){
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
                res.render(ejsPrefix+"binding",{
                    id:data.result.id
                })
            }
        });
    }
    else if(null != req.query.wechatUserId && req.query.wechatUserId != ''){
        res.render(ejsPrefix+"login",{
            id:req.query.wechatUserId
        })
    }
    else{
        res.render(ejsPrefix+"login",{id:''})
    }

});


//商户登陆
router.post('/login', function (req, res, next) {
    logger.error("==="+JSON.stringify(req.body))
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/merchant/merchantLogin",
            body: req.body,
            method: 'POST',
            json:true
        });
    }).then(function (data) {
        var returnObj = {
            msg:data.message,
            code:data.code
        };
        if(null != data.result && null != data.result.token){
            res.cookie('authToken',data.result.token);
            returnObj.wechatUserInfo = data.result.wechatUserInfo
            returnObj.wechatUserInfo.adminUsername = data.result.userInfo.username
        }
        res.json(returnObj)

        logger.error(JSON.stringify(data))
    });
});


//跳转到主页
router.get('/main', function (req, res, next) {
    res.render(ejsPrefix+"main")
});


//微信绑定后台账号
router.post('/binding', function (req, res, next) {
    logger.error("==="+JSON.stringify(req.body))
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/merchant/bindingAdmin",
            body: req.body,
            method: 'POST',
            json:true
        });
    }).then(function (data) {
        var returnObj = {
            msg:data.message,
            code:data.code
        };
        if(null != data.result && null != data.result.id){
            returnObj.id = data.result.id
        }
        res.json(returnObj)

        logger.error(JSON.stringify(data))
    });
});


//跳转到注册页面
router.get('/toRegister', function (req, res, next) {
    res.render(ejsPrefix+"regist",{
        wechatUserId: req.query.wechatUserId
    })
});

//注册商户账号
router.post('/regist', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/sysAdmin/user/regist",
            body: req.body,
            method: 'POST',
            json:true
        });
    }).then(function (data) {
        res.json(data)
    });
});


//跳转到修改密码界面
router.get('/toFindpwd', function (req, res, next) {
    res.render(ejsPrefix+"findpwd",{
        wechatUserId: req.query.wechatUserId
    })
});

//找回密码
router.post('/findpwd', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/sysAdmin/user/findpwd",
            body: req.body,
            method: 'PUT',
            json:true
        });
    }).then(function (data) {
        res.json(data)
    });
});



module.exports = router;
