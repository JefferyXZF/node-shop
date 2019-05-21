//定义商品分类集合

var mongoose = require('mongoose');
var categoryIdSchema = new mongoose.Schema({
    "categoryId": String, // 商品分类ID
    "categoryName": String, // 商品分类名
    "createTime": String, // 创建时间
    "updateTime": String,  // 更新时间
    "status": String,   // 商品状态 1 启用 0 禁用
    "sorting": Number,  // 排序数值越低越前
    "desc": String  // 商品分类描述
})
module.exports = mongoose.model("category", categoryIdSchema);