var express = require('express');
var router = require('express-promise-router')();
var cRequest = require("../lib/customRequest");
var constant = require("../constant");
var Promise = require("bluebird");
var logger = require("../lib/common").logger("index");



router.get('/doGET',function (req, res, next) {
    console.log(JSON.stringify(req.query));
    return Promise.try(function () {
        return cRequest.sendRequest(req,  res, {
            url: constant.BASE_PATH + req.query.reqUrl,
            qs: req.query,
            method: 'GET'
        });
    }).then(function (data) {
        res.json(data);
    });
});

router.get('/doDELETE',function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req,  res, {
            url: constant.BASE_PATH + req.query.reqUrl,
            qs: req.query,
            method: 'DELETE'
        });
    }).then(function (data) {
        res.json(data);
    });
});

router.post('/doPUT', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + req.body.reqUrl,
            body: req.body,
            method: 'PUT',
            json:true
        });
    }).then(function (data) {
        logger.error("----"+JSON.stringify(data));
        res.json(data);
    });
});

router.post('/doPOST', function (req, res, next) {
    return Promise.try(function () {
        return cRequest.sendRequest(req, res, {
            url: constant.BASE_PATH + req.body.reqUrl,
            body: req.body,
            method: 'POST',
            json:true
        });
    }).then(function (data) {
        logger.error("----"+JSON.stringify(data));
        res.json(data);
    });
});

module.exports = router;
