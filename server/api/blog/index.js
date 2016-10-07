'use strict';

var controller = require('./blog.controller');
var Auth = require('../../auth/authService');
var multer = require('multer');
var upload = multer({dest:'uploads/'});
var express = require('express');
var router = express.Router();

//发布文章
router.put("/addBlog",Auth.hasRole('admin'),controller.addBlog);
router.put("/updateBlog",Auth.hasRole('admin'),controller.updateBlog);
router.delete("/delBlog",Auth.hasRole('admin'),controller.destroy);
router.get("/getBlog",controller.getBlog);
router.get("/getArticle",Auth.hasRole('admin'),controller.getArticle);
router.get("/getBlogList",controller.getBlogList);
router.get("/getEndBlogList",controller.getEndBlogList);
router.get("/getPreNext",controller.getPreNext);
router.get("/toggleLike",Auth.isAuthenticated(),controller.toggleLike);
router.post("/uploadImg",Auth.hasRole('admin'),upload.single('file'),controller.uploadImg);

module.exports = router;  
