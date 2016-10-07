'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var Tag = mongoose.model('Tag');
var User = mongoose.model('User');

exports.addTag = function(req,res,next){
    var name = req.body.name;
    var err_msg;
    if("" === name){
        err_msg = "标签名称不能为空！";
    }
    
    if(err_msg){
        return res.status(422).send({err_message:err_msg});
    }
    
    Tag.findOneAsync({name:name}).then(function(tag){
        if(tag){
            return res.status(403).send({err_message:"标签已经存在了！"});
        }else{
            return Tag.createAsync(req.body).then(function(result){
                return res.status(200).send({flag:true});
            })
        }
    }).catch(function(err){
        next(err);
    });
}

exports.delTag = function(req,res,next){
    var id = req.query._id;
    var err_msg;
    if('' === id){
        err_msg = '标签id不能为空！';
    }
    if(err_msg){
       return res.status(422).send({err_message:err_msg}); 
    }
    
    Tag.findByIdAndRemoveAsync(id).then(function(a){
        if(a){
            return res.status(200).send({flag:true});
        }else{
            return res.status(403).send({err_message:"删除标签失败！"});
        }
    }).catch(function(err){
        return next(err);
    });
}

exports.getTagList = function(req,res,next){
    Tag.findAsync().then(function(result){
        return res.status(200).send({data:result});
    }).catch(function(err){
        return next(err);
    });
}