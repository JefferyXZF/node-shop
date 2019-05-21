// 订单管理
var express = require('express');
var router = express.Router();
var OrderController = require('./../controller/user/order');

// 生成订单
router.post('/createOrder', OrderController.createOrder);
// 删除订单
router.post('/delOrder', OrderController.delOrder);
// 获取订单列表
router.post('/orderList', OrderController.getOrderList);
// 获取订单详情
router.post('/orderDetail', OrderController.getOrderDetail);
// 更新订单
router.post('/updateOrder', OrderController.updateOrderState);
// 批量支付
router.post('/batchPay', OrderController.batchUpdateOrder);
// 管理后台获得所有订单
router.post('/manageOrder', OrderController.manageOrder);
// 管理员更改订单状态
router.post('/managerUpdateOrder', OrderController.manageUpdateOrderStatus);
// 管理员删除订单
router.post('/managerDeleteOrder', OrderController.managerDeleteOrder);
// 管理员根据订单ID搜索订单
router.post('/searchOrderByID', OrderController.searchOrderByID);

module.exports =  router;