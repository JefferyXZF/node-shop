var express = require('express');
var router = express.Router();
var UserController = require('./../controller/user/user');

// 用户登录
router.post('/login', UserController.login);
// 用户登出
router.post('/loginOut', UserController.logOut);
// 用户注册
router.post('/register', UserController.register);
//获取用户信息
router.post('/userInfo', UserController.getUserInfo);
//上传头像
router.post('/uploadHeadPic', UserController.uploadHeadImage);
// 收藏商品 取消商品
router.post('/collection', UserController.doCollection);
// 收藏我的列表
router.post('/collectList', UserController.getCollectionList);
module.exports = router;
