//商品管理路由

var express = require('express');
var router = express.Router();
var GoodsManage = require('./../controller/goods/goods');

// 添加商品
router.post('/add', GoodsManage.addGoods);
// 显示商品列表
router.post('/list', GoodsManage.getGoodsList);
// 查询商品详情
router.post('/find', GoodsManage.getGoodsById);
// 更新商品
router.post('/update', GoodsManage.updateGoods);
// 更新商品状态 上架 下架
router.post('/updateState', GoodsManage.updateGoodsState);
// 删除商品
router.post('/delete', GoodsManage.deleteGoods);
// 商品按分组查询
router.post('/productHome', GoodsManage.getGoodsByGroup);
// 根据商品分类ID查询商品
router.post('/category', GoodsManage.getGoodsByCategory);
// 根据商品名搜索商品
router.post('/search', GoodsManage.getGoodsByName);
// 轮播图片
router.post('/swiper', GoodsManage.getSwiperGoods);

module.exports =  router;