// 购物车管理
var express = require('express');
var router = express.Router();
var CartController = require('./../controller/user/cart');

// 获取购物车列表
router.post('/cartList', CartController.getCartList);
// 添加购物车
router.post('/addCart', CartController.addCart);
// 批量添加购物车
router.post('/addCartBatch', CartController.addCartBatch);
// 修改购物车数量
router.post('/editCart', CartController.updateCartNum);
// 购物车全选
router.post('/editCheckAll', CartController.checkAll);
// 删除购物车
router.post('/delCart', CartController.delCart);
// 批量删除购物车
router.post('/batchDeleteCart', CartController.batchDeleteCart);

module.exports =  router;