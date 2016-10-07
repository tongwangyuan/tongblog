'use strict';
var config = require("./../server/config/env");
var express = require('express');
var path = require('path');
module.exports = function (app) {
    app.set('port', process.env.PORT || config.port);
    //向前台发送静态文件
    app.use('/public', express.static(path.resolve(__dirname, '../public')));

    app.get('/', function (req, res, next) {
        res.sendFile(path.resolve(__dirname, '../index.html'));
    });
    
    app.use('/auth', require('./auth'));
    app.use('/api/users', require('./api/user'));
    app.use('/api/tags', require('./api/tag'));
    app.use('/api/blog', require('./api/blog'));
    app.use('/api/comment', require('./api/comment'));
}