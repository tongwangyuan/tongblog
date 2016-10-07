/**
 * 初始化数据
 */

'use strict';

var mongoose = require('mongoose');
var	User = mongoose.model('User');
//var	Article = mongoose.model('Article');
//var	TagCategory = mongoose.model('TagCategory');
//var	Tag = mongoose.model('Tag');
var Promise = require('bluebird');

	//初始化标签,文章,用户
	if(process.env.NODE_ENV === 'development'){
		User.countAsync().then(function (count) {
			 if(count === 0){
			 	User.removeAsync().then(function () {
			 		User.createAsync({
			 			nickname:'tongtong',
			 			email:'tongwangyuan@163.com',
			 			role:'admin',
			 			password:'tongtong88',
                        phone:18397000000,
			 			status:1
			 		},{
			 			nickname:'test001',
			 			email:'test001@test.com',
			 			role:'user',
			 			password:'test',
                        phone:18397000000,
			 			status:1
			 		},{
			 			nickname:'test002',
			 			email:'test002@test.com',
			 			role:'user',
			 			password:'test',
                        phone:18397000000,
			 			status:2
			 		},{
			 			nickname:'test003',
			 			email:'test003@test.com',
			 			role:'user',
			 			password:'test',
                        phone:18397000000,
			 			status:0
			 		});
			 	});
			}
		});
	}