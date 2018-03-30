/**
 * 商户验证
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


//验证是否认证
router.get('/checkIsCertification', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/merchant/getByAdminId/"+req.query.adminId,
            method: 'GET'
        });
    }).then(function (data) {
        res.json(data)
    });
});

//前往认证页面
router.get('/edit', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/merchant/getByAdminId/"+req.query.adminId,
            method: 'GET'
        });
    }).then(function (data) {
        if(null != data.result && data.res != '' && null != data.result.businessScopes && data.result.businessScopes.length > 0){
            var typeIds = '',typeNames = '';
            data.result.businessScopes.forEach(function (value,i) {
                if(i == 0){
                    typeIds += value.typeId;
                    typeNames += value.typeName;
                }
                else{
                    typeIds += "," + value.typeId;
                    typeNames += "," + value.typeName;
                }
            });
            data.result.typeIds = typeIds;
            data.result.typeNames = typeNames;
        }
        var returnObj = {
            wxconfigUrl: constant.SYSTEM_PATH + req.originalUrl,
            basePath:constant.SYSTEM_PATH,
            adminId:req.query.adminId
        }
        returnObj.merchantInfo = data.result;
        if(null == returnObj.merchantInfo){
            returnObj.merchantInfo = {}
        }
        res.render(ejsPrefix+"certification",returnObj)
    });
});

router.post('/saveOrUpdate', function (req, res, next) {

    if(null == req.body.id || req.body.id == ''){
        req.body.id = common.createUUID(32);
    }

    if(null != req.body.businessScopeIds && req.body.businessScopeIds != ''){
        var businessScopeIds = req.body.businessScopeIds.split(",");
        var businessScopes = new Array();
        for(var i=0; i<businessScopeIds.length; i++){
            businessScopes.push({
                id:common.createUUID(32),
                merchantId:req.body.id,
                typeId:businessScopeIds[i]
            })
        }
        req.body.businessScopes = businessScopes;
    }

    logger.debug("---------"+JSON.stringify(req.body))
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/merchant/saveOrUpdate",
            body: req.body,
            method: 'POST',
            json:true
        });
    }).then(function (data) {
        res.json(data)
    });
});


module.exports = router;
