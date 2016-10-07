'use strict';

var controller = require('./tag.controller');
var Auth = require('../../auth/authService');
var express = require('express');
var router = express.Router();

//增加标签
router.post('/addTag',Auth.hasRole('admin'),controller.addTag);
router.delete('/delTag',Auth.hasRole('admin'),controller.delTag);
router.get('/getTagList',controller.getTagList);

module.exports = router;
