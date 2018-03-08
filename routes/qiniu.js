
var express = require('express');
var router = require('express-promise-router')();
var cRequest = require("../lib/customRequest");
var constant = require("../constant");
var Promise = require("bluebird");
var common = require("../lib/common");
var logger = require("../lib/common").logger("index");
var qiniu = require("qiniu");


var mac = new qiniu.auth.digest.Mac('6Lke3aMkl3-g5X1gYUltXVDN9yssUpQ43QHmFqZN', 'PLl0XB-VxENrr7JtLdNCRMgVaXFD36DUODKZIBM6');
var config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;
var bucketManager = new qiniu.rs.BucketManager(mac, config);
/* GET home page. */
router.get('/fetch', function (req, res, next) {


    var resUrl = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token="+req.query.accessToken+"&media_id="+req.query.serverId;
    var bucket = "develop";
    var key = fileName();
    bucketManager.fetch(resUrl,bucket,key,function(err, respBody, respInfo){
        var returnData = {};
        if (err) {
            returnData.msg = err
            console.log(err);
            //throw err;
        }
        else{
            returnData.msg = 1;
            if (respInfo.statusCode == 200) {
                console.log(respBody.key);
                console.log(respBody.hash);
                console.log(respBody.fsize);
                console.log(respBody.mimeType);
                returnData.key = respBody.key
            } else {
                console.log(respInfo.statusCode);
                console.log(respBody);
            }
        }
        res.json(returnData);
    });

});

function fileName(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    if(month < 10) month = "0"+month
    var day = date.getDate();
    if(day < 10) day = "0"+day
    var hour = date.getHours();
    if(hour < 10) hour = "0"+hour
    var minutes = date.getMinutes();
    if(minutes < 10) minutes = "0"+minutes
    var seconds = date.getSeconds();
    if(seconds < 10) seconds = "0"+seconds
    var str = year+""+month+""+day+""+hour+""+minutes+""+seconds+"_"+common.createUUID(6)+".jpg"
    return str
}



module.exports = router;
