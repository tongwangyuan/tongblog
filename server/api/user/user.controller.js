'use strict';

var ccap = require("ccap")();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require("../../util/log");


//得到验证码
exports.getAuthCode = function (req, res) {
    var ary = ccap.get();
    var txt = ary[0];
    var buf = ary[1];
    req.session.captcha = txt;
    return res.status(200).send(buf);
}

//获取用户信息
exports.getMe = function (req, res) {
    var id = req.user._id;
    User.findByIdAsync(id).then(function(user){
        return res.status(200).send(user.userInfo);  
    }).catch(function(err){
        return res.status(500).send();
    });
}

//注册
exports.sigin = function (req, res) {
    var nickname = req.body.nickName?req.body.nickName.replace(/(^\s+)|(\s+$)/g, ""):'';
	var email = req.body.email?req.body.email.replace(/(^\s+)|(\s+$)/g, ""):'';
	var password = req.body.password?req.body.password.replace(/(^\s+)|(\s+$)/g, ""):'';
	var phone = req.body.phone?req.body.phone.replace(/(^\s+)|(\s+$)/g, ""):'';
	var NICKNAME_REGEXP = /^[(\u4e00-\u9fa5)0-9a-zA-Z\_\s@]+$/;
    var EMAIL_REGEXP = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var PASSWORD_REG = /^[a-zA-Z0-9]{6,20}$/;
    var PHONE_REG = /^1\d{10}$/;
	var error_msg;
    var iconRand = 15;
    var iconDomamin = require('../../config/env').qiniu.domain + "blog/article/icon_";
    iconRand = Math.floor(Math.random()*15);
    iconDomamin = iconDomamin + iconRand +".jpg";
	if(nickname === ''){   
		error_msg = "呢称不能为空";
	}else if(email === ''){
		error_msg = "邮箱地址不能为空";
	}else if(nickname.length <= 2 || nickname.length >15 || !NICKNAME_REGEXP.test(nickname)){
		//不符合呢称规定.
		error_msg = "呢称不合法";
	}else if(email.length <=4 || email.length > 30 || !EMAIL_REGEXP.test(email)){
		error_msg = "邮箱地址不合法";
	}else if('' === password){
        error_msg = "密码不能为空";
    }else if(!PASSWORD_REG.test(password)){
        error_msg = "密码不合法";
    }
	if(error_msg){
		return res.status(422).send({error_msg:error_msg});
	}
    var newUser = new User({
        nickname:nickname,
        email: email,
        password: password,
        phone: phone,
        icon:iconDomamin
    });
    
    newUser.saveAsync().then(function (user) { 
        logger.info('sigin user :' +user.nickname+"success");
        return res.status(200).send(user);
    }).catch(function(err){
        if(err.errors && err.errors.nickname){
			err = {error_msg:err.errors.nickname.message}
		}
		return res.status(500).send(err);
    });
}

//获取用户列表
exports.getUserList = function(req,res,next){
    var currentPage = (parseInt(req.query.currentPage) > 0)?parseInt(req.query.currentPage):1;
	var itemsPerPage = (parseInt(req.query.itemsPerPage) > 0)?parseInt(req.query.itemsPerPage):10;
	var startRow = (currentPage - 1) * itemsPerPage;

	var sortName = String(req.query.sortName) || "created";
	var sortOrder = req.query.sortOrder;
	if(sortOrder === 'false'){
		sortName = "-" + sortName;
	}


	User.countAsync().then(function (count) {
		return User.find({})
			.skip(startRow)
			.limit(itemsPerPage)
			.sort(sortName)
			.exec().then(function (userList) {
				return res.status(200).json({ data: userList, count:count });
			})
	}).catch(function (err) {
		return next(err);
	})
}

//删除用户
exports.delUser = function(req,res,next){
    var userId = req.user._id;
    
    if(String(userId) === req.query.id){
        return res.status(403).send({err_message:'不能删除正在登录用户！'});
    }else{
        User.findByIdAndRemoveAsync(req.query.id).then(function(d){
            logger.info('del user which id is:' + req.query.id +"success");
            res.status(200).send({flag:true});
        }).catch(function(err){
            res.status(400).send({err_message:'删除用户失败！'});
        })
    }
}

//后台增加用户；
exports.addUser = function (req, res) {
    var nickname = req.body.nickName?req.body.nickName.replace(/(^\s+)|(\s+$)/g, ""):'';
	var email = req.body.email?req.body.email.replace(/(^\s+)|(\s+$)/g, ""):'';
	var password = req.body.password?req.body.password.replace(/(^\s+)|(\s+$)/g, ""):'';
	var phone = req.body.phone?req.body.phone.replace(/(^\s+)|(\s+$)/g, ""):'';
	var NICKNAME_REGEXP = /^[(\u4e00-\u9fa5)0-9a-zA-Z\_\s@]+$/;
    var EMAIL_REGEXP = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var PASSWORD_REG = /^[a-zA-Z0-9]{6,20}$/;
    var PHONE_REG = /^1\d{10}$/;
	var error_msg;
	if(nickname === ''){   
		error_msg = "呢称不能为空";
	}else if(email === ''){
		error_msg = "邮箱地址不能为空";
	}else if(nickname.length <= 2 || nickname.length >15 || !NICKNAME_REGEXP.test(nickname)){
		//不符合呢称规定.
		error_msg = "呢称不合法";
	}else if(email.length <=4 || email.length > 30 || !EMAIL_REGEXP.test(email)){
		error_msg = "邮箱地址不合法";
	}else if('' === password){
        error_msg = "密码不能为空";
    }else if(!PASSWORD_REG.test(password)){
        error_msg = "密码不合法";
    }
	if(error_msg){
		return res.status(422).send({error_msg:error_msg});
	}
    var newUser = new User({
        nickname:nickname,
        email: email,
        password: password,
        phone: phone
    });
    
    newUser.saveAsync().then(function (user) { 
        logger.info('create user :' +user.nickname+"success");
        return res.status(200).send({success:true,data:user});
    }).catch(function(err){
        if(err.errors && err.errors.nickname){
			err = {error_msg:err.errors.nickname.message}
		}
		return res.status(500).send(err);
    });
}
