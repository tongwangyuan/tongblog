'use strict';

var express = require('express');
var controller = require('./comment.controller');
var Auth = require('../../auth/authService');

var router = express.Router();

//前台增加评论
router.put('/addComment',Auth.isAuthenticated(),controller.addNewComment);
router.get('/getCommentList',controller.getFrontCommentList);
router.put('/addReply',Auth.isAuthenticated(),controller.addNewReply);
router.delete('/delComment',Auth.hasRole('admin'),controller.delComment);
router.delete('/delReply',Auth.hasRole('admin'),controller.delReply);


module.exports = router;