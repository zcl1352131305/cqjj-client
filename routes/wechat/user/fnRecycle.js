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
var ejsPrefix = 'wechat/user/';


router.get('/edit', function (req, res, next) {
    console.log(req.originalUrl)
    var isFromMenu = req.query.isFromMenu;
    var returnObj = {
        wxconfigUrl: constant.SYSTEM_PATH + req.originalUrl,
        basePath:constant.SYSTEM_PATH,
        isFromMenu: isFromMenu,
    }
    //是否是从菜单跳转而来
    if(isFromMenu== 'true'){
        return Promise.try(function () {
            return cRequest.sendRequest(req, res, {
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
            returnObj.recycle = {
                id: '',
                fnImgs:[]
            }
            res.render(ejsPrefix+"fnRecyle_publish",returnObj);
        });
    }
    else{
        //var wxconfigUrl = constant.SYSTEM_PATH+"/wechat/user/fnRecycle/edit?isFromMenu="+req.query.isFromMenu
        //是否是编辑
        if(null != req.query.id && req.query.id != ''){
            return Promise.try(function () {
                return cRequest.sendRequest(req, res, {
                    url: constant.BASE_PATH + "/cqjjTrade/furnitureRecycle/get/"+req.query.id,
                    method: 'GET'
                });
            }).then(function (data) {
                logger.error("----"+JSON.stringify(data));
                //var wxconfigUrl = constant.SYSTEM_PATH+"/wechat/user/fnRecycle/edit?isFromMenu="+req.query.isFromMenu+"&code="+req.query.code+"&state="+req.query.state
                if(null == data.result.fnImgs){
                    data.result.fnImgs = []
                }
                returnObj.recycle = data.result
                res.render(ejsPrefix+"fnRecyle_publish",returnObj);
            });
        }
        else{
            returnObj.recycle = {
                id: '',
                fnImgs:[]
            }
            res.render(ejsPrefix+"fnRecyle_publish",returnObj);
        }
    }

});

router.post('/saveOrUpdate', function (req, res, next) {
    var returnData = {};

    var files = common.paramStrToArray(req.body.furnitureImg)
    if(null == req.body.id || req.body.id == ''){
        req.body.id = common.createUUID(32)
    }
    var fnImgs = [];
    if(files != null && files.length > 0){
        for(var i=0; i<files.length; i++){

            //如果没指定标题图则默认第一张为标题图
            if(i == 0){
                if(req.body.headImg == null || req.body.headImg == ''){
                    req.body.headImg = files[i]
                }
            }

            fnImgs.push({
                id: common.createUUID(32),
                recycleId: req.body.id,
                url:files[i]
            })
        }
    }
    req.body.fnImgs = fnImgs;

    console.log(JSON.stringify(req.body))

    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/furnitureRecycle/saveOrUpdate",
            body: req.body,
            method: 'POST',
            json:true
        });
    }).then(function (data) {
        res.render(ejsPrefix+"publish_success",data);
    });

});


router.get('/fnType', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/furnitureType/all",
            method: 'GET',
        });
    }).then(function (data) {
        logger.error(JSON.stringify(data))
        res.json(data.result);
    });
})



module.exports = router;
