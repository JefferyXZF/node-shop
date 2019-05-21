//商品集合

var mongoose =require('mongoose')
var Schema =mongoose.Schema; //定义表模型
var produtSchema= new Schema({
    "productId": String, // 商品ID
    "productName": String, // 商品名称
    "subTitle": String, // 商品描述
    "salePrice": Number, // 折扣价格
    "price": Number, // 销售价格
    "discount": Number, //折扣
    "color": Array, //商品颜色
    "size": Array, //商品尺码
    "salesVolume": Number, //销量
    "postage": Number, //邮费
    "address": String, //商品销售地址
    "smallImage": Array, //小图片
    "productImage": Array, //商品图片
    "limitNum": Number, //限制购买数量
    "productMsg": String, //商品详情
    "content": Array, //评论
    "createDate": String, // 创建时间
    "updateDate": String, // 更新时间
    "status": Number, //商品状态  1 上架  0 下架
    "parameter": Object, //商品参数
    "categoryID": {    //关联商品分类表
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    "evaluation": Array,  // 订单评价
    "type": Number,  // 商品类型  1 首页轮播商品  2 新品 3 最热商品
    "inventory": Number
})
//导出produtSchema到goods表
module.exports=mongoose.model('good',produtSchema)