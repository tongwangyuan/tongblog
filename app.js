'use strict';

// 设置默认环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'development';//production;development
var express = require('express');
var http = require("http");
var path = require("path");
var mongoose = require("mongoose");
var fs = require("fs");
var config = require("./server/config/env");

mongoose.connect(config.mongo.uri, config.mongo.options);


var modelsPath = path.join(__dirname, 'server/model');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(modelsPath + '/' + file);
    }
});
//mongoose promise 风格
mongoose.Promise = global.Promise;
var app = new express();

app.listen(config.port, function (req, res, next) {
    console.log('server start on ' + config.port);
})

// 初始化数据
if(config.seedDB) { require('./server/config/seedDB'); }

require('./server/config/express')(app);
require('./server/router')(app);

exports = module.exports = app;
