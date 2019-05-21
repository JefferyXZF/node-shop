var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    "userId": String,
    "name": String,
    "headPic": String, // 头像
    "userName": String,
    "userPwd": String,
    "orderList": Array, // 订单列表
    "collectGoods": Array, // 收藏的商品
    "comment": Array, // 商品评论
    "cartList": [   // 购物车列表
        {
            "productId": String,
            "size": String,
            "color": String,
            "productName": String,
            "checked": String,
            "productNum": Number,
            "salePrice": Number,
            "smallImage": String,
            "bigImage": String,
            "checked": Number
        }
    ],
    'addressList': [    // 地址列表
        {
            "addressId": String,
            "userName": String,
            "streetName": String,
            "tel": Number,
            "isDefault": Boolean
        }
    ]
})

module.exports = mongoose.model('User', userSchema);