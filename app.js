'use strict';

// 设置默认环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'development';//production;development
var express = require('express');
var http = require("http");
var https = require("https");
var path = require("path");
var mongoose = require("mongoose");
var fs = require("fs");
var config = require("./server/config/env");

mongoose.connect(config.mongo.uri, config.mongo.options);
//mongoose promise 风格
mongoose.Promise = global.Promise;

var modelsPath = path.join(__dirname, 'server/model');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(modelsPath + '/' + file);
    }
});
var app = new express();
//根据项目的路径导入生成的证书文件  
var privateKey  = fs.readFileSync(path.join(__dirname, './cert/214276705600727.key'), 'utf8');  
var certificate = fs.readFileSync(path.join(__dirname, './cert/214276705600727.pem'), 'utf8');  
var credentials = {key: privateKey, cert: certificate};  
let httpServer = http.createServer(app);   
let httpsServer = https.createServer(credentials,app);
httpServer.listen(config.port, function (req, res, next) {
    console.log('server start on ' + config.port);
})

httpsServer.listen(5001, function (req, res, next) {
    console.log('server start on  https' + 5001);
})

// 初始化数据
if(config.seedDB) { require('./server/config/seedDB'); }

require('./server/config/express')(app);
require('./server/router')(app);

exports = module.exports = app;
