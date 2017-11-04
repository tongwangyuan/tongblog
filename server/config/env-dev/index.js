'use strict';

var path = require('path');
var _ = require('lodash');
var fs = require('fs');

var all = {
  env: process.env.NODE_ENV,
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 5000,
  //mongodb配置
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  //redis 配置
  redis: { 
    host: '127.0.0.1',
    port: 6379
  },
  //是否初始化数据
  seedDB: false,
  session:{
    secrets: 'tong-secret',
  },
  //用户角色种类
  userRoles: ['user', 'admin'],
  //七牛配置
  qiniu:{
    app_key:'',
    app_secret:'',
    domain:'https://s.tongwangyuan.com/',          //七牛配置域名
    bucket:'blog'           //七牛空间名称  
  },
  //默认首页图片.
  defaultIndexImage:"",
  //第三方登录配置
  github:{
    clientID:"",
    clientSecret:"",
    callback:"/auth/github/callback"
  },
  weibo:{
    clientID:"",
    clientSecret:"",
    callbackURL:"/auth/weibo/callback"
  },
  qq:{
    clientID:"",
    clientSecret:"",
    callbackURL:"/auth/qq/callback"
  },
  //开启第三方登录
  snsLogins:['github','qq']
};

var config = _.merge(all,require('./' + process.env.NODE_ENV + '.js') || {});

module.exports = config;