// 收货地址管理
var express = require('express');
var router = express.Router();
var AddressController = require('./../controller/user/address');

// 获取地址列表
router.post('/addressList', AddressController.getAddressList);
// 添加地址
router.post('/addressAdd', AddressController.addAddress);
// 修改地址
router.post('/addressUpdate', AddressController.updateAddress);
// 删除地址
router.post('/addressDel', AddressController.delAddress);

module.exports =  router;

