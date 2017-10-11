'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var markDownIt = require('markdown-it');
var qiniuHelper = require('../../util/qiniu');
var Article = mongoose.model('Article');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

//发布博客
exports.addBlog = function(req,res,next){
    var title = req.body.title;
    var content = req.body.content;
    var err_msg = "";
    
    if("" === title){
        err_msg = "标题不能位空！";
    }else if("content" ===content){
        err_msg = '内容不能为空！';
    }
    req.body.publish_time = new Date(req.body.publish_time);
    if(err_msg){
        res.status(422).send({err_message:err_msg});
    }
    //Article.
    return Article.createAsync(req.body).then(function (result) {
		return res.status(200).json({success: true,article_id:result._id});
	}).catch(function (err) {
	 	return next(err);
	});
}

//后台获取单篇博客
exports.getArticle = function (req,res) {
	//var id = req.params.id;
	var id = req.query.id;
	Article.findOne({_id:id})
		.populate('tags')//如果标签页页要更新的话，通过popution来关联tag文档；
		.exec().then(function (article) {
            console.log(article);
			return res.status(200).json({data:article});
		}).then(null,function (err) {
			return res.status(500).send();
		});
}

//更新博客
exports.updateBlog = function (req,res,next) {
	var id = req.body.id;
	/*if(req.body._id){
	  delete req.body._id;
	}*/
	var content = req.body.content;
	var title = req.body.title;
	var error_msg;
	if(!title){
		error_msg = '标题不能为空.';
	}else if(!content){
		error_msg = '内容不能为空.';
	}
	if(error_msg){
		return res.status(422).send({error_msg:error_msg});
	}
	//将图片提取存入images,缩略图调用
	//req.body.images = tools.extractImage(content);
	req.body.updated = new Date();
	if(req.body.isRePub){
		req.body.publish_time = new Date();
	}

	Article.findByIdAndUpdateAsync(id,req.body,{new:true}).then(function(article){
		return res.status(200).json({success:true,article_id:article._id});
	}).catch(function(err){
		return next(err);
	});
}

//把图片发布到七牛
exports.uploadImg = function(req,res,next){
    var file = req.file;
	if(!file){
		return res.status(422).send({error_msg:"缺少文件参数."});
	}
	var fileName =  new Date().getTime() + file.originalname;
	qiniuHelper.upload(file.path,'blog/article/' + fileName).then(function (result) {
		return res.status(200).json({success:true,img_url:result.url});
	}).catch(function (err) {
		return next(err);
	});
}

//删除博客
exports.destroy = function(req,res,next){
    if(void 0 === req.query.id){
        return res.status(403).send({err_message:'文章id不合法！'});
    }else{
        Article.findByIdAndRemoveAsync(req.query.id).then(function(d){
            return Comment.removeAsync({aid:req.query.id}).then(function(){
                return res.status(200).send({flag:true});
            })
        }).catch(function(err){
            return res.status(400).send({err_message:'删除文章失败！'});
        })
    }
}
//前台预览博客
exports.getBlog = function(req,res,next){
    var id = req.query.id;
    var err_msg = "";
    var md = markDownIt({
        html:true
    })
    if("" === id){
        err_msg = "文章索引不能为空！";
    }
    
    if(err_msg){
        res.status(422).send({err_message:err_msg});
    }
    
    return Article.findByIdAsync(id).then(function(blog){
        blog.content = md.render(blog.content);
        Article.findByIdAndUpdateAsync(id,{$inc:{visit_count:1}});
        return res.status(200).send({data:blog});
    }).catch(function(err){
        return next(err);
    })
}
//前台获取博客列表；
exports.getBlogList = function(req,res,next){
    var currentPage = (parseInt(req.query.currentPage) > 0)?parseInt(req.query.currentPage):1;
	var itemsPerPage = (parseInt(req.query.itemsPerPage) > 0)?parseInt(req.query.itemsPerPage):10;
	var startRow = (currentPage - 1) * itemsPerPage;
    var sort =  req.query.sort?String(req.query.sort):"-publish_time";
    var condition = {status:1};
    
    if(req.query.tagId){
        condition = _.defaults(condition,{tags:{$elemMatch:{$eq:req.query.tagId}}});
    }
    Article.find(condition)
        .select('title images visit_count comment_count like_count publish_time')
        .skip(startRow)
        .limit(itemsPerPage) 
        .sort(sort)
        .exec()
        .then(function(blog){
            return res.status(200).send({data:blog});
        }).catch(function(err){
            return next(err);
    })
}

//后台获取博客列表；
exports.getEndBlogList = function(req,res,next){
    var currentPage = (parseInt(req.query.currentPage) > 0)?parseInt(req.query.currentPage):1;
	var itemsPerPage = (parseInt(req.query.itemsPerPage) > 0)?parseInt(req.query.itemsPerPage):10;
	var startRow = (currentPage - 1) * itemsPerPage;
    var sort =  req.query.sort?String(req.query.sort):"-publish_time";
    Article.countAsync().then(function (count) {
        Article.find()
            .select('title images visit_count comment_count like_count publish_time status')
            .skip(startRow)
            .limit(itemsPerPage) 
            .sort(sort)
            .exec()
            .then(function(blog){
                return res.status(200).send({data:blog,count:count});
            }).catch(function(err){
                return next(err);
        })
    }).catch(function(err){
            return next(err);
    })
}

//前台获取上一篇和下一篇
exports.getPreNext = function (req,res,next) {
	var id = req.query.id;
	var sort = String(req.query.sortName) || "publish_time";
	var preCondition,nextCondition;
	preCondition = {status:{$gt:0}};
	nextCondition = {status:{$gt:0}};
	if(req.query.tagId){
		//tagId = new mongoose.Types.ObjectId(tagId);
		var tagId = String(req.query.tagId);
		preCondition =  _.defaults(preCondition,{ tags: { $elemMatch: { $eq:tagId } } });
		nextCondition =  _.defaults(nextCondition,{ tags: { $elemMatch: { $eq:tagId } } });
	}
	Article.findByIdAsync(id).then(function (article) {
		//先获取文章,
		if(sort === 'visit_count'){
			preCondition = _.defaults(preCondition,{'_id':{$ne:id},'visit_count':{'$lte':article.visit_count}});
			nextCondition = _.defaults(nextCondition,{'_id':{$ne:id},'visit_count':{'$gte':article.visit_count}});
		}else{
			preCondition = _.defaults(preCondition,{'_id':{$ne:id},'publish_time':{'$lte':article.publish_time}});
			nextCondition = _.defaults(nextCondition,{'_id':{$ne:id},'publish_time':{'$gte':article.publish_time}});
		}
		var prePromise = Article.find(preCondition)
			.select('title')
			.limit(1)
			.sort('-' + sort)
			.exec();

		var nextPromise = Article.find(nextCondition)
				.select('title')
				.limit(1)
				.sort(sort)
				.exec();
		prePromise.then(function (preResult) {
			var prev = preResult[0] || {};
			return nextPromise.then(function (nextResult) {
				var next = nextResult[0] || {};
				return {'next':next,'prev':prev};
			})
		}).then(function (result) {
			return res.status(200).json({data:result});
		})
	}).catch(function (err) {
		return next(err);
	})
}

//给文章点赞
exports.toggleLike = function (req,res,next) {
  var aid = new mongoose.Types.ObjectId(req.query.id);
  var userId = req.user._id;
  //如果已经喜欢过了,则从喜欢列表里,去掉文章ID,并减少文章喜欢数.否则添加到喜欢列表,并增加文章喜欢数.	
  //var isLink = _.indexOf(req.user.likeList.toString(), req.params.id);
  var isLike = _.findIndex(req.user.likeList, function(item) {
    return item.toString() == req.query.id;
  });
  var conditionOne,conditionTwo,liked;
  if(isLike !== -1){
  	conditionOne = {'$pull':{'likeList':aid}};
  	conditionTwo = {'$inc':{'like_count':-1}};
  	liked = false;
  }else{
  	conditionOne = {'$addToSet':{'likeList':aid}};
  	conditionTwo = {'$inc':{'like_count':1}};
  	liked = true;
  }

  User.findByIdAndUpdateAsync(userId,conditionOne).then(function (user) {
  	return Article.findByIdAndUpdateAsync(aid,conditionTwo,{new:true}).then(function (article) {
  		return res.status(200).json({success:true,'count':article.like_count,'isLike':liked});
  	});
  }).catch(function (err) {
  	return next(err);
  });
}