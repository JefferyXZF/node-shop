//商品分类controller
var fs = require('fs');
var path = require('path');
var uuidv4 = require('uuid/v4');
var Goods = require('./../../models/goods/goods');
var Category = require('./../../models/category/category');

var GoodsManage = {
    //添加商品
    addGoods: function (req, res, next) {
        var date = new Date().getTime(); // 创建日期
        var datas=new Date(date).toLocaleString().replace(/\//g, "-");
        var productName = req.body.productName; // 商品名称
        var subTitle = req.body.subTitle; // 商品描述
        var salePrice = req.body.salePrice; // 商品折扣价
        var price = req.body.price;  // 商品销售价格
        var discount = req.body.discount; // 商品折扣
        var color = req.body.color; // 商品颜色
        var size = req.body.size; // 商品尺码
        var postage = req.body.postage; // 邮费
        var address = req.body.address; // 商品出售地址
        var smallImage = req.body.smallImage; // 商品图片
        var productImage = req.body.productImage; // 商品图片
        var limitNum = req.body.limitNum; // 商品限制购买数量
        var inventory = req.body.inventory; // 商品库存数量
        var productMsg = req.body.productMsg;   // 商品详情
        var parameter = req.body.parameter; // 商品参数
        var categoryID = req.body.categoryID;   // 商品分类ID
        var type = req.body.type;  // 商品类型
        var status = req.param("status") || 1;   // 商品状态 1 上架 0 下架
        Goods.create({
            productId:uuidv4(),
            productName:productName,
            subTitle: subTitle,
            salePrice:salePrice,
            price: price,
            discount: discount,
            color: color,
            size: size,
            postage: postage,
            address: address,
            smallImage: smallImage,
            productImage: productImage,
            limitNum: limitNum,
            inventory: inventory,
            productMsg: productMsg,
            status: status,
            parameter: parameter,
            categoryID: categoryID,
            createDate: datas,
            updateDate: datas,
            type: type
        },function(err,doc){
            if (err) {
                res.json({
                    code:'1',
                    msg:err.message,
                    data:''
                })
            } else {
                res.json({
                    code:'0',
                    msg:"添加成功",
                    data:""
                })
            }
        })
    },
    // 获得商品列表
    getGoodsList: function (req, res, next) {
        var curPage = parseInt(req.body.curPage) || 1, //当前页
            pageSize = parseInt(req.body.pageSize) || 10, //页目条数
            skip = (curPage-1)*pageSize,
            total, //总的条数
            productName = req.body.productName,
            categoryID = req.body.categoryID,
            // all = req.param("all"),
            params = {};

        // 获得所有的商品列表
        if (productName) {
            // 模糊查询总条数
            params = {
                productName: {$regex:productName}
            }
            Goods.find(params).count(function(err, res){
                total=res
            });
        } else if (categoryID) {
            if (categoryID === 'all') { // 选择全部
                params = {}
                Goods.count(function(err, res){
                    if(err){
                        console.log(err)
                    }else{
                        total=res
                    }
                })
            } else {
                params = {
                    categoryID: categoryID
                };
                Goods.find(params).count(function(err, res){
                    total=res
                });
            }
        } else {
            //列表所有条数
            params = {};
            Goods.count(function(err, res){
                if(err){
                    console.log(err)
                }else{
                    total=res
                }
            })
        }
        //Goods.find(params)查找所有数据 skipt跳过条数limit()获取多少跳
        var goodsModel=Goods.find(params).skip(skip).limit(pageSize);
        goodsModel.exec({},function(err,doc){
            if (err) {
                res.json({
                    code:"1",
                    msg:err.message
                });
            }else{
                res.json({
                    code:"0",
                    data:{
                        curPage: curPage,
                        pageSize: pageSize,
                        total: total,
                        list:doc
                    }
                })
            }
        })
    },
    //获取商品详情
    getGoodsById: function (req, res, next) {
        var productId = req.body.productId;
        if (productId) {
            Goods.findOne({"productId":productId},function(err,doc){
                if (err) {
                    res.json({
                        code:"1",
                        msg:err.message,
                        data: ""
                    })
                } else {
                    res.json({
                        code:"0",
                        msg:"成功",
                        data:doc
                    })
                }
            })
        } else {
            res.json({
                code:"1",
                msg:"获取商品失败",
                data:""
            })
        }
    },
    //更新商品
    updateGoods: function (req, res, next) {
        var adminId = req.cookies.adminId;
        var date = new Date().getTime(); // 创建日期
        var datas=new Date(date).toLocaleString().replace(/\//g, "-");
        var productId = req.body.productId; // 商品名称
        var productName = req.body.productName; // 商品名称
        var subTitle = req.body.subTitle; // 商品描述
        var salePrice = req.body.salePrice; // 商品折扣价
        var price = req.body.price;  // 商品销售价格
        var discount = req.body.discount; // 商品折扣
        var color = req.body.color; // 商品颜色
        var size = req.body.size; // 商品尺码
        var postage = req.body.postage; // 邮费
        var address = req.body.address; // 商品出售地址
        var smallImage = req.body.smallImage; // 商品图片
        var productImage = req.body.productImage; // 商品图片
        var limitNum = req.body.limitNum; // 商品限制购买数量
        var inventory = req.body.inventory; // 商品库存数量
        var productMsg = req.body.productMsg;   // 商品详情
        var parameter = req.body.parameter; // 商品参数
        var categoryID = req.body.categoryID;   // 商品分类ID
        var type = req.body.type;  // 商品类型
        if(adminId!=undefined){
            Goods.update({productId:productId}, {
                    productName:productName,
                    subTitle: subTitle,
                    salePrice:salePrice,
                    price: price,
                    discount: discount,
                    color: color,
                    size: size,
                    postage: postage,
                    address: address,
                    smallImage: smallImage,
                    productImage: productImage,
                    limitNum: limitNum,
                    inventory: inventory,
                    productMsg: productMsg,
                    parameter: parameter,
                    categoryID: categoryID,
                    updateDate: datas,
                    type: type
                },
                function (err,doc) {
                if(err){
                    res.json({
                        code:"1",
                        msg:err.message,
                        data:""
                    });
                }else{
                    res.json({
                        code:"0",
                        msg:"修改成功",
                        data:""
                    });
                }
            })
        }else{
            res.json({
                code:"10001",
                msg:"非法操作",
                data:""
            })
        }
    },
    // 更新商品状态 state 1 上架 0 下架
    updateGoodsState: function(req, res, next) {
        var adminId = req.cookies.adminId,
            productId = req.body.productId,
            status = req.body.status;

        if(adminId !== undefined){
            var params = {
                status: status
            };
            Goods.update({productId:productId}, params, function (err,doc) {
                if(err){
                    res.json({
                        code:"1",
                        msg:err.message,
                        data:""
                    });
                }else{
                    res.json({
                        code:"0",
                        msg:"修改成功",
                        data:""
                    });
                }
            })
        }else {
            res.json({
                code:"10001",
                msg:"非法操作",
                data:""
            })
        }
    },
    //删除商品
    deleteGoods: function (req, res, next) {
        var adminId = req.cookies.adminId;
        var productId = req.body.productId;
        var detailUrl = [],
            smallUrl = [],
            bigUrl = [];
        if(adminId !== undefined){
            Goods.findOne({"productId":productId},function(err,doc){
                if (err) {
                    console.log('在删除图片前查询小图、大图和详情图' + err.message)
                } else {
                    if (doc) {

                        detailUrl = matchImagePath(doc.productMsg);
                        smallUrl = doc.smallImage;
                        bigUrl = doc.productImage;
                    }
                }
            })
            Goods.remove({
                "productId":productId
            },function(err,doc){
                if(err){
                    res.json({
                        code:"1",
                        msg:err.message,
                        data:""
                    })
                }else{
                    res.json({
                        code:"0",
                        msg:"删除成功",
                        data:""
                    });
                    //删除本地小图、大图和详情图照片
                    if (detailUrl && detailUrl[0]) {
                        delImgBatch(detailUrl);
                    }
                    if (smallUrl && smallUrl[0]) {
                        delImgBatch(smallUrl);
                    }
                    if (bigUrl && bigUrl[0]) {
                        delImgBatch(bigUrl);
                    }
                }
            })
        }else{
            res.json({
                code:"10001",
                msg:"非法操作",
                data:""
            })
        }
    },
    // 商品按商品类分组查询
    getGoodsByGroup(req, res, next) {
        Category.aggregate([ // Category表和Goods表连接查询
            {
                $lookup: {
                    from: "goods",     // 需要连接的表名
                    localField: "_id",   // 本表需要关联的字段
                    foreignField: "categoryID",    // 被连接表需要关联的字段
                    as: "goodsData"     // 查询出的结果集别名
                }
            }], function (err, doc) {
            if (err) {
                res.json({
                    code:"1",
                    msg:err.message,
                    data:""
                })
            } else {
                if (doc) {
                    res.json({
                        code: "0",
                        msg: "成功",
                        data: doc
                    })
                }
            }
        })
    },
    // 根据商品分类ID查询商品
    getGoodsByCategory (req, res, next) {
        var categoryId = req.body.categoryId;
        var sort = req.body.sort;
        var minPrice = req.body.minPrice || 0;
        var maxPrice = req.body.maxPrice || 0;
        var params = {};
        params.categoryID = categoryId;
        if (!categoryId) {
            params = {}
        }
        if (minPrice < 0 || maxPrice < 0) {
            res.json({
                code:"1",
                msg:"输入价格范围不合法",
                data:""
            })
        }
        if (minPrice > 0) {
            params.salePrice = {$gt: minPrice}
        }
        if (maxPrice > 0) {
            params.salePrice = {$lt: maxPrice}
        }
        if (minPrice > 0 && maxPrice > 0) {
            params.salePrice = { $gt: minPrice, $lt: maxPrice };
        }

        var goodsDoc = Goods.find(params).sort({'salePrice': sort});
        goodsDoc.exec({},function(err,doc){
            if (err) {
                res.json({
                    code:"1",
                    msg:err.message,
                    data: ""
                })
            } else {
                res.json({
                    code:"0",
                    msg:"成功",
                    data:doc
                })
            }
        })
    },
    // 根据商品名查询商品
    getGoodsByName: function (req, res, next) {
        var productName = req.body.productName;
        var params = {};
        if (!productName) {
            //列表所有条数
            params = {};
        } else {
            // 模糊查询总条数
            params = {
                productName: {$regex:productName}
            }
        }
        Goods.find(params, function (err, doc) {
            if (err) {
                res.json({
                    code:"1",
                    msg:err.message,
                    data: ""
                })
            } else {
                res.json({
                    code:"0",
                    msg:"success",
                    data: doc
                })
            }
        })
    },
    // 轮播图片
    // 根据商品名查询商品
    getSwiperGoods: function (req, res, next) {
        Goods.find({type: 1}, function (err, doc) {
            if (err) {
                res.json({
                    code:"1",
                    msg:err.message,
                    data: ""
                })
            } else {
                if (doc.length > 0) {
                    res.json({
                        code:"0",
                        msg:"success",
                        data: doc
                    })
                }
            }
        })
    }
};

// 匹配详情中字符串的图片路径
function matchImagePath(str) {
    if (str) {
        // 匹配img标签
        let imgArr = str.match(/<img.*?src="(.*?)".*?\/?>/ig);
        let srcArr = []
        // 匹配src值
        if (imgArr && imgArr[0]) {
            srcArr = imgArr.map(item =>
                item.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1]
            )
        }
        return srcArr
    }
}


/**
 * 批量删除图片
 * @param url (Array)
 * @param isRetun (Array) 是否给前台返回数据
 */
function delImgBatch(urlArr) {
    for (var i = 0, len = urlArr.length; i < len; i++) {
        var url = path.join(__dirname, './../../',urlArr[i]);
        var flag = fs.existsSync(url);
        if (flag) {
            fs.unlinkSync(url);
        }
    }
}

module.exports = GoodsManage