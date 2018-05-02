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
var ejsPrefix = 'wechat/merchant/account/';


/**  销售记账信息  **/
//销售记账
router.get('/sale', function (req, res, next) {
    console.log(req.originalUrl)
    var returnObj = {}
    //是否是编辑
    if(null != req.query.id && req.query.id != ''){
        return Promise.try(function () {
            return cRequest.sendRequest(req, res, {
                url: constant.BASE_PATH + "/cqjjTrade/account/sale/get/"+req.query.id,
                method: 'GET'
            });
        }).then(function (data) {
            logger.error("----"+JSON.stringify(data));
            returnObj.transaction = data.result;
            returnObj.target = req.query.target;
            res.render(ejsPrefix+"transaction_account",returnObj);
        });
    }
    else{
        returnObj.transaction = {
            id: '',

        };
        returnObj.target = req.query.target;
        res.render(ejsPrefix+"transaction_account",returnObj);
    }

});

//销售记账保存
router.post('/sale/saveOrUpdate', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/account/sale/saveOrUpdate",
            body: req.body,
            method: 'POST',
            json:true
        });
    }).then(function (data) {
        res.json(data);
    });
});

//销售记账成功
router.get('/sale/toAccountSuccess', function (req, res, next) {
    res.render(ejsPrefix+"transaction_account_success",{
        id:req.query.id
    });
});

//获取销售记账记录列表
router.get('/sale/accountRecordList', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/account/sale/list",
            qs: req.query,
            method: 'GET'
        });
    }).then(function (data) {
        logger.error("----"+JSON.stringify(data));
        res.json(data);
    });
});

//删除销售记账
router.get('/sale/deleteAccountRecord', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/account/sale/remove/"+req.query.id,
            method: 'DELETE'
        });
    }).then(function (data) {
        res.json(data);
    });
});



//记账记录列表页
router.get('/toAccountRecordList', function (req, res, next) {
    res.render(ejsPrefix+"account_list");
});




/**  尾款信息  **/
//待收尾款列表页
router.get('/toNeedGathering', function (req, res, next) {
    res.render(ejsPrefix+"need_gathering");
});

//更新记账信息
router.post('/updateNeedGathering', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/account/sale/update",
            body: req.body,
            method: 'PUT',
            json:true
        });
    }).then(function (data) {
        logger.error("----"+JSON.stringify(data));
        res.json(data);
    });
});

//获取记账记录列表
router.get('/needGatheringCount', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/account/sale/needGatheringCount",
            qs: req.query,
            method: 'GET'
        });
    }).then(function (data) {
        logger.error("----"+JSON.stringify(data));
        res.json(data);
    });
});

module.exports = router;
