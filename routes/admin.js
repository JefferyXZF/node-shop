//管理员路由

var express = require('express');
var router = express.Router();
var Manager = require('./../controller/admin/admin');

//管理员登录
router.post('/login', Manager.login);
//获取管理员信息
router.get('/info', Manager.getInfo);
//退出登录
router.get('/logout', Manager.logout);

module.exports =  router;