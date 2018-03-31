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


//商户初始化，判断商户是否绑定后台账户
router.get('/init', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/furnitureType/all",
            method: 'GET',
        });
    }).then(function (data) {
        res.render(ejsPrefix+"furniture_list",{
            fnTypes:data.result,
            isNew:req.query.isNew,
            fnType:req.query.fnType
        })
    });

});

router.get('/frontPage', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/furnitureSale/frontPage",
            qs:req.query,
            method: 'get',
        });
    }).then(function (data) {
        logger.error('+++++'+JSON.stringify(data))
        res.json(data);
    });
});

/*router.get('/detail', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/furnitureRecycle/get/"+req.query.id,
            method: 'get',
        });
    }).then(function (data) {
        logger.error('+++++'+JSON.stringify(data))
        res.render(ejsPrefix+"recycle_detail",data);
    });
});*/

module.exports = router;
