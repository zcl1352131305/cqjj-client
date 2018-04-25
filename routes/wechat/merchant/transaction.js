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
var ejsPrefix = 'wechat/merchant/transaction/';


router.get('/account', function (req, res, next) {
    console.log(req.originalUrl)
    var returnObj = {}
    //是否是编辑
    if(null != req.query.id && req.query.id != ''){
        return Promise.try(function () {
            return cRequest.sendRequest(req, res, {
                url: constant.BASE_PATH + "/cqjjTrade/transaction/get/"+req.query.id,
                method: 'GET'
            });
        }).then(function (data) {
            logger.error("----"+JSON.stringify(data));
            returnObj.transaction = data.result;
            res.render(ejsPrefix+"transaction_edit",returnObj);
        });
    }
    else{
        returnObj.transaction = {
            id: ''
        }
        res.render(ejsPrefix+"transaction_account",returnObj);
    }


});



router.post('/saveOrUpdate', function (req, res, next) {

    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/transaction/saveOrUpdate",
            body: req.body,
            method: 'POST',
            json:true
        });
    }).then(function (data) {
        res.json(data);
    });

});


//发布成功
router.get('/toAccountSuccess', function (req, res, next) {
    res.render(ejsPrefix+"transaction_account_success",{
        id:req.query.id
    });
});

module.exports = router;
