'use strict';

var controller = require('./user.controller');
var Auth = require('../../auth/authService');
var express = require('express');
var router = express.Router();

//请求验证码
router.get('/getAuthCode',controller.getAuthCode);
router.post('/sigin',controller.sigin);
router.get('/me',Auth.isAuthenticated(),controller.getMe);
router.get('/userlist',Auth.hasRole('admin'),controller.getUserList);
router.delete('/delUser',Auth.hasRole('admin'),controller.delUser);
router.put('/addUser',Auth.hasRole('admin'),controller.addUser);

module.exports = router;
