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
    app_key:'9VwziFx1415JkijaSWrHMY_XFaRnuLukR5QwUhmx',
    app_secret:'jSh3L1OQtj1cZjKLkl7hJ9ByCfcb-V-e2Yj6k_An',
    domain:'http://s.tongwangyuan.com/',          //七牛配置域名
    bucket:'blog'           //七牛空间名称  
  },
  //默认首页图片.
  defaultIndexImage:"",
  //第三方登录配置
  github:{
    clientID:"833cf076b7f2ea012c36",
    clientSecret:"2b430076c06b578c037b411d75e96478996dd2eb",
    callback:"/auth/github/callback"
  },
  weibo:{
    clientID:"116819499",
    clientSecret:"4710b62eec7ce314ba9c2e57061bea8e",
    callbackURL:"/auth/weibo/callback"
  },
  qq:{
    clientID:"101287997",
    clientSecret:"42fa7a7ff1bae9a9f3e15809d66a54cf",
    callbackURL:"/auth/qq/callback"
  },
  //开启第三方登录
  snsLogins:['github','qq']
};

var config = _.merge(all,require('./' + process.env.NODE_ENV + '.js') || {});

module.exports = config;