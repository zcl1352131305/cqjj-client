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


//跳转到主页
router.get('/main', function (req, res, next) {
    var returnObj = {};
    if(null != req.query.code && req.query.code != ''){
        return Promise.try(function () {
            return cRequest.sendRequest(req,  res, {
                url: constant.BASE_PATH + "/cqjjTrade/wechat/auth" + "/OAuth2",
                qs: {
                    code: req.query.code
                },
                method: 'GET'
            });
        }).then(function (data) {
            logger.error("----"+JSON.stringify(data));
            //var wxconfigUrl = constant.SYSTEM_PATH+"/wechat/user/fnRecycle/edit?isFromMenu="+req.query.isFromMenu+"&code="+req.query.code+"&state="+req.query.state
            returnObj.userInfo = data.result;
            res.render(ejsPrefix+"main",returnObj);
        });
    }
    else{
        res.render(ejsPrefix+"main");
    }



});

router.get('/personal', function (req, res, next) {
    res.render(ejsPrefix+"personal");
});





module.exports = router;
