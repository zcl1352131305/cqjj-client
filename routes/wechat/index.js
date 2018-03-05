/**
 * 微信推送
 * Created by Administrator on 2017/9/20 0020.
 */
var router = require('express-promise-router')();
var cRequest = require("../../lib/customRequest");
var common = require("../../lib/common");
var constant = require("../../constant");
var Promise = require("bluebird");
var logger = require("../../lib/common").logger("wechatIndex");

//ejs文件路径前缀
var ejsPrefix = 'wechat/';


router.get('/init', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + "/cqjjTrade/wechat/auth" + "/OAuth2",
            qs: {
                code: req.query.code
            },
            method: 'GET'
        });
    }).then(function (data) {
        logger.error(JSON.stringify(data));
        data.module = req.query.module;
        res.render(ejsPrefix+"index",data);
    });
});


module.exports = router;
