'use strict';

var express = require('express');
var compression = require('compression');//相当于gzip压缩，对静态资源进行压缩；
var bodyParser = require('body-parser');
var cors = require('cors');//解决跨域请求；
var methodOverride = require('method-override');//Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
var cookieParser = require('cookie-parser');
var path = require('path');
var passport = require('passport');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var config = require('./env');

module.exports = function(app) { 
  app.enable('trust proxy');
  var options = {
    origin: true,//运行跨域；
    credentials: true//设置‘Access-Control-Allow-Credentials’header；
  };
  app.use(cors(options));
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(session({
    secret: config.session.secrets,
    resave: false,
    saveUninitialized: false,
    /*store: new RedisStore({
      host:config.redis.host,
      port:config.redis.port,
      pass:config.redis.password || ''
    }),*/
    cookie: config.session.cookie
  }));
  app.use(passport.initialize());
};
