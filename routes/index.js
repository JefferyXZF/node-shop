
var address = require('./address');
var admin = require('./admin') ;
var cart = require('./cart');
var category = require('./category');
var goods = require('./goods');
var img = require('./img');
var order = require('./order');
var user = require('./users');
var pay = require('./../pay/index');




module.exports = function (app) {
    //收货地址
    app.use('/address', address);
    //管理员
    app.use('/admin', admin);
    //购物车管理
    app.use('/cart', cart);
    //商品分类管理
    app.use('/category', category);
    //商品管理
    app.use('/goods', goods);
    //图片上传和删除
    app.use('/upload', img);
    //订单
    app.use('/order', order);
    //用户
    app.use('/user', user);
    //支付
    app.use('/pay', pay);

};

