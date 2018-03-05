var express = require('express');
var router = require('express-promise-router')();
var cRequest = require("../lib/customRequest");
var constant = require("../constant");
var Promise = require("bluebird");
var logger = require("../lib/common").logger("index");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/qzxweb/main/index');
});



module.exports = router;
