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
var logger = require("../../../lib/common").logger("wechatMenu");

//ejs文件路径前缀
var ejsPrefix = 'wechatFront/matrixes/';

router.get('/init', function (req, res, next) {
    var returnData = {};
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/h/message/messageWechatMatrixes/selectList",
            method: 'GET'
        });
    }).then(function (data) {
        returnData.data = data;
        logger.error(JSON.stringify(returnData));
        res.render(ejsPrefix+"matrixes_list",returnData);
    });
});


module.exports = router;
