'use strict';

// 开发环境配置
// ==================================
module.exports = {
  //开发环境mongodb配置
  mongo: {
    uri: 'mongodb://tong:tongtong88@localhost:12345/tong-dev',
    options:{
        useMongoClient:true
    }
  },
  //开发环境redis配置
  redis: {
    db: 0//分库操作，如果不写，则不分库
  },
  seedDB: true,
  session:{
    cookie:  {maxAge: 60000*5}
  }
};