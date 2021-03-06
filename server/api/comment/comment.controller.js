'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var Blog = mongoose.model('Article');
var User = mongoose.model('User');

//添加新的评论.
exports.addNewComment = function (req,res,next) {
	var aid = req.body.aid;
	var content = req.body.content;
	var userId = req.user._id;
	var error_msg;
	if(!aid){
		error_msg = '缺少必须参数';
	}else if(!content || content == ''){
		error_msg = "评论内容不能为空";
	}
	if(error_msg){
		return res.status(422).send({error_msg:error_msg});
	}
	Comment.createAsync({
		aid:aid,
		content:content,
		user_id:userId
	}).then(function (result) {
		var comment = result.toObject();
		comment.user_id = {
			_id:req.user._id,
			nickname:req.user.nickname,
			avatar:req.user.avatar,
            icon:req.user.icon
		}
		Blog.findByIdAndUpdateAsync(aid,{$inc:{comment_count:1}});
		return res.status(200).json({success:true,data:comment});
	}).catch(function (err) {
		return next(err);
	});
}

//获取评论列表.
exports.getFrontCommentList = function (req,res,next) {
	var aid = req.query.aid;
	Comment.find({aid:aid,status:{$eq:1}})
	.sort('created')
	.populate({
		path: 'user_id',
		select: 'nickname avatar icon'
	})
	.exec().then(function (commentList) {
		return res.status(200).json({data:commentList});
	}).then(null,function (err) {
		return next(err);
	});
}

//添加回复
exports.addNewReply = function (req,res,next) {
	var cid = req.body.cid;
	if(!req.body.content || req.body.content == ''){
		return res.status(422).send({error_msg:"回复内容不能为空"});
	}
	var reply = req.body;
  reply.user_info = {
  	id:req.user._id,
  	nickname:req.user.nickname
  }
  reply.created = new Date();
	Comment.findByIdAndUpdateAsync(cid,{"$push":{"replys":reply}},{new:true}).then(function (result) {
        var uid = result.user_id;
        return User.findByIdAsync(uid).then(function(users){
            return res.status(200).json({success:true,data:result,user_info:{_id:uid,nickname:users.nickname}});
        });
        
	}).catch(function (err) {
		return next(err);
	});
}

//删除评论.
exports.delComment = function (req,res,next) {
	var cid = req.query.id;
	Comment.findByIdAndRemoveAsync(cid).then(function (result) {
		//评论数-1  
		Blog.findByIdAndUpdateAsync(result.aid,{$inc:{comment_count:-1}});
		return res.status(200).json({success:true});
	}).catch(function (err) {
		return next(err);
	})
}

//删除回复
exports.delReply = function (req,res,next) {
	var cid = req.query.cid;
	var rid = req.query.rid;
	if(!rid){
		return res.status(422).send({error_msg:"缺少回复ID."});
	}
	Comment.findByIdAndUpdateAsync(cid,{$pull:{replys:{ _id:mongoose.Types.ObjectId(rid) }}},{new:true}).then(function (result) {
        var uid = result.user_id;
        var results = result;
        return User.findByIdAsync(uid).then(function(users){
		        return res.status(200).json({success:true,data:results,user_info:{_id:uid,nickname:users.nickname}});
        });
	}).catch(function (err) {  
		return next(err);
	});
}