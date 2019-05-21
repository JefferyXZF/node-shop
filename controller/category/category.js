//商品分类controller
var uuidv1 = require('uuid/v1');
var Category = require('./../../models/category/category');
var Goods = require('./../../models/goods/goods');

var GoodsCategory = {
    //添加商品分类
    add: function (req, res, next) {
        var categoryName = req.param("categoryName").trim();
        var desc = req.param("desc").trim();
        var sorting = req.param("sorting");
        if (!categoryName) {
            res.json({
                code:"1",
                msg:"商品分类名输入无效",
                data:""
            })
        }
        if (categoryName) {
            Category.findOne({categoryName: categoryName}, function (err, doc) {
                if (err) {
                    res.json({
                        code:"1",
                        msg:err.message,
                        data:""
                    })
                } else if (doc) {
                    res.json({
                        code:"1",
                        msg:"商品类别已存在",
                        data:""
                    })
                } else {
                    var date = new Date().getTime()
                    var datas=new Date(date).toLocaleString().replace(/\//g, "-");
                    Category.create({
                        categoryId: uuidv1(),
                        categoryName: categoryName,
                        createTime: datas,
                        updateTime: datas,
                        status:"1",
                        sorting: sorting,
                        desc: desc
                    },function(err,doc){
                        if (err) {
                            res.json({
                                code:"1",
                                msg:err.message,
                                data:""
                            })
                        } else {
                            res.json({
                                code:"0",
                                msg:"添加成功",
                                data:""
                            })
                        }
                    })
                }
            })
        } else {
            res.json({
                code: "1",
                msg: "分类名不能为空"
            });
        }
    },
    /**
     * 查询所有商品
     * 前端需要：总条数，每页条数，当前页
     * 分页查询：当前页，总页数，每页条数
     * @param req
     * @param res
     * @param next
     */
    getGoodsCategory: function (req, res, next) {
        var curPage = parseInt(req.param("curPage")) || 1, //当前页
            pageSize = parseInt(req.param("pageSize")) || 10, //页目条数
            skip = (curPage-1)*pageSize,
            total, //总的条数
            categoryName = req.param("categoryName"),
            all = req.param("all"),
            params = {};
        var type = req.param('type');
        // 获得所有的分类
        if (all == 'list') {
            Category.find({}, function (err, doc) {
                if (err) {
                    res.json({
                        code:"1",
                        msg:err.message
                    });
                } else {
                    res.json({
                        code:"0",
                        data: doc
                    });
                }
            })
            return;
        }
        if (categoryName) {
            // 模糊查询总条数
            params = {
                categoryName: {$regex:categoryName}
            }
            Category.find(params).count(function(err, res){
                total=res
            });
        } else {
            //列表所有条数
            params = {};
            if (type == 'public') {
                params.status = 1
            }
            Category.count(function(err, res){
                if(err){
                    console.log(err)
                }else{
                    total=res
                }
            })
        }
        //Goods.find(params)查找所有数据 skipt跳过条数limit()获取多少跳
        var categoryModel=Category.find(params).skip(skip).limit(pageSize).sort({"sorting": 1});
        categoryModel.exec({},function(err,doc){
            if (err) {
                res.json({
                    code:"1",
                    msg:err.message
                });
            }else{
                if (type == 'public') {
                    res.json({
                        code:"0",
                        data: doc
                    })
                } else {
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
            }
        })
    },
    //根据id查询商品分类
    getCategoryById: function (req, res, next) {
        var categoryId = req.param("categoryId");
        if (categoryId) {
            Category.findOne({"categoryId":categoryId},function(err,doc){
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
        }
    },
    //更新商品分类
    updateCategory: function (req, res, next) {
        var adminId = req.cookies.adminId;
        var categoryId = req.param("categoryId");
        var params = {};
        var date = new Date().getTime();
        var datas=new Date(date).toLocaleString().replace(/\//g, "-");
        params.categoryName = req.param("categoryName");
        params.status = req.param("status");
        params.desc = req.param("desc");
        params.sorting = req.param("sorting");
        params.updateTime = datas;

        if(adminId!=undefined){
            // 判断更新的商品名是否已经存在，如果是原来的商品名则可以更新，如果不是则不能更新，显示商品名已经存在
            Category.findOne({categoryId: categoryId}, function (err, doc) {
                if (err) {
                    res.json({
                        code:"1",
                        msg:err.message,
                        data:""
                    })
                } else if (doc) {
                    if (doc.categoryName == params.categoryName) {
                        Category.update({categoryId:categoryId}, params, function (err,doc) {
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
                    } else {
                        Category.findOne({categoryName: params.categoryName}, function (err, doc) {
                            if (err) {

                            } else {
                                if (doc) {
                                    res.json({
                                        code:"1",
                                        msg:"更新失败，商品类别已存在",
                                        data:""
                                    })
                                }  else {
                                    Category.update({categoryId:categoryId}, params, function (err,doc) {
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
                                }
                            }
                        })

                    }
                } else {
                    return;
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
    //删除商品分类
    deleteCategory: function (req, res, next) {
        var adminId = req.cookies.adminId,
            _id = req.param("_id"),
            categoryId = req.param("categoryId");
        if(adminId!=undefined){
            // 先查询该分类下是否有商品，如果有商品则不能删除该分类
            Goods.findOne({categoryID: _id}, function (err, doc) {
                if (err) {
                    res.json({
                        code: "1",
                        msg: err.message,
                        data: ""
                    })
                } else if (doc) {
                    res.json({
                        code: "1",
                        msg: "商品分类下已有商品，不能删除该分类",
                        data: ""
                    })
                } else {
                    Category.remove({
                        "categoryId": categoryId
                    }, function (err, doc) {
                        if (err) {
                            res.json({
                                code: "1",
                                msg: err.message,
                                data: ""
                            })
                        } else {
                            res.json({
                                code: "0",
                                msg: "删除成功",
                                data: ""
                            })
                        }
                    })
                }
            })
        } else{
            res.json({
                code:"10001",
                msg:"非法操作",
                data:""
            })
        }
    }

}

module.exports = GoodsCategory