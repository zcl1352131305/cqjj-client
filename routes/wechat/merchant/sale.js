/**
 * 家具回收
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


router.get('/edit', function (req, res, next) {
    console.log(req.originalUrl)
    var returnObj = {
        wxconfigUrl: constant.SYSTEM_PATH + req.originalUrl,
        basePath:constant.SYSTEM_PATH,
    }
    //是否是编辑
    if(null != req.query.id && req.query.id != ''){
        return Promise.try(function () {
            return cRequest.sendRequest(req, res, {
                url: constant.BASE_PATH + "/cqjjTrade/furnitureSale/get/"+req.query.id,
                method: 'GET'
            });
        }).then(function (data) {
            logger.error("----"+JSON.stringify(data));
            //var wxconfigUrl = constant.SYSTEM_PATH+"/wechat/user/fnRecycle/edit?isFromMenu="+req.query.isFromMenu+"&code="+req.query.code+"&state="+req.query.state
            if(null == data.result.fnImgs){
                data.result.fnImgs = []
            }
            returnObj.sale = data.result
            res.render(ejsPrefix+"sale_publish",returnObj);
        });
    }
    else{
        returnObj.sale = {
            id: '',
            fnImgs:[]
        }
        res.render(ejsPrefix+"sale_publish",returnObj);
    }


});

router.post('/saveOrUpdate', function (req, res, next) {
    var returnData = {};

    var files = req.body.furnitureImg.split(",");
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
                saleId: req.body.id,
                url:files[i]
            })
        }
    }
    req.body.fnImgs = fnImgs;

    console.log("----"+JSON.stringify(req.body))

    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/furnitureSale/saveOrUpdate",
            body: req.body,
            method: 'POST',
            json:true
        });
    }).then(function (data) {
        res.json(data);
    });

});

//发布成功
router.get('/toPublishSuccess', function (req, res, next) {
    res.render(ejsPrefix+"sale_publish_success",{
        id:req.query.id
    });
});


//我的发布
router.get('/toMyPublish', function (req, res, next) {
    res.render(ejsPrefix+"my_publish");
});

router.get('/myPublishPage', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/furnitureSale/page",
            qs:req.query,
            method: 'get',
        });
    }).then(function (data) {
        logger.error('+++++'+JSON.stringify(data))
        res.json(data);
    });
});

router.post('/updateSale', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/furnitureSale/update",
            body: req.body,
            method: 'PUT',
            json:true
        });
    }).then(function (data) {
        res.json(data);
    });
});

router.get('/deleteSale', function (req, res, next) {

    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/furnitureSale/remove/" + req.query.id,
            method: 'DELETE'
        });
    }).then(function (data) {
        res.json(data);
    });

});


module.exports = router;
