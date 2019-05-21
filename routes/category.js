//商品分类路由

var express = require('express');
var router = express.Router();
var GoodsCategory = require('./../controller/category/category');

//添加分类
router.get('/add', GoodsCategory.add);
//查询所有分类
router.get('/list', GoodsCategory.getGoodsCategory);
//根据id查询
router.get('/find', GoodsCategory.getCategoryById);
//更新分类
router.get('/update', GoodsCategory.updateCategory);
//删除分类
router.get('/delete', GoodsCategory.deleteCategory);

module.exports =  router;
