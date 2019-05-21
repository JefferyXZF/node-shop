// 购物车
var uuidv4 = require('uuid/v4');

var User = require('../../models/users/users');

var CartController = {
    // 获取购物车
    getCartList: function (req, res, next) {
        var userId = req.cookies.userId;
        if (userId) {
            var userDoc = User.findOne({userId: userId});
            if (userDoc) {
                var cartList = userDoc.cartList;
                res.json({
                    code: '0',
                    msg: 'success',
                    count: cartList.length,
                    data: cartList
                })
            } else {
                res.json({
                    code: 0,
                    msg: "用户不存在",
                    data: ''
                })
            }
        } else {
            res.json({
                code: '1',
                msg: '未登录',
                data: ''
            })
        }
    },
    // 加入购物车
    addCart: function (req, res, next) {
        var userId = req.cookies.userId;
        var params = req.body.params;
        if (userId) {
            try {
                User.findOne({userId: userId}, function (err, userDoc) {
                    if (err) {
                        res.json({
                            code: '1',
                            msg: err.message,
                            data: ''
                        })
                    } else {
                        if (userDoc) {
                            // 商品是否存在
                            var have = false;
                            //  购物车有内容
                            if (userDoc.cartList.length) {
                                // 遍历用户名下的购物车列表
                                for (var value of userDoc.cartList) {
                                    // 找到该商品
                                    if (value.productId === params.productId) {
                                        have = true;
                                        value.productNum += params.productNum;
                                        break;
                                    }
                                }
                            }
                            // 购物车无内容 或者 未找到商品 则直接添加
                            if (!userDoc.cartList.length || !have) {
                                userDoc.cartList.push(params)
                            }
                            userDoc.save(function(err, doc) {
                                // 保存成功
                                res.json({
                                    code: '0',
                                    msg: '加入购物车成功',
                                    data: ''
                                })
                            })

                        } else {
                            res.json({
                                code: '1',
                                msg: '用户不存在',
                                data: ''
                            })
                        }
                    }
                });
            } catch (err) {
                res.json({
                    code: 1,
                    msg: err.message,
                    data: ''
                })
            }

        } else {
            res.json({
                status: 1,
                msg: '用户未登录',
                result: ''
            })
        }
    },
    /**
     * 批量加入购物车
     * @param req
     * @param res
     * @param next
     */
    addCartBatch: function (req, res, next) {
        var userId = req.cookies.userId,
            productMsg = req.body.productMsg;
        if (userId) {
            try {
                User.findOne({userId: userId}, function(err, userDoc) {
                    if (userDoc) {
                        var addCartId = [];
                        //  购物车有内容
                        if (userDoc.cartList.length > 0 && productMsg.length > 0) {
                            productMsg.forEach((item, i) => {
                                // 找到该商品
                                userDoc.cartList.forEach((pro, index) => {
                                    if (item.productId === pro.productId) {
                                        pro.productNum += Number(item.productNum)
                                        addCartId.push(item.productId)
                                    }
                                })
                            });
                            if (addCartId.length > 0) {
                                let filterArr = productMsg.filter(item => {
                                    return addCartId.indexOf(item.productId) == -1
                                })
                                if (filterArr.length > 0) {
                                    userDoc.cartList.push(...filterArr)
                                }
                            }
                            userDoc.save(function (err2, doc2) {
                                // 保存成功
                                if (doc2) {
                                    res.json({
                                        code: '0',
                                        msg: '加入购物车成功',
                                        data: 'success'
                                    })
                                }
                            })
                        } else {
                            if (productMsg.length) {
                                userDoc.cartList.push(...productMsg);
                                userDoc.save(function (err2, doc2) {
                                    // 保存成功
                                    if (doc2) {
                                        res.json({
                                            code: '0',
                                            msg: '加入成功',
                                            data: 'success'
                                        })
                                    }
                                })
                            }
                        }
                    }
                })
            } catch (err) {
                res.json({
                    code: 1,
                    msg: err.message,
                    data: ''
                })
            }

        } else {
            res.json({
                code: '1',
                msg: '未登录',
                data: ''
            })
        }
    },
    // 修改购物车数量
    updateCartNum: function (req, res, next) {
        var userId = req.cookies.userId,
            productId = req.body.productId,
            productNum = req.body.productNum > 10 ? 10 : req.body.productNum,
            checked = req.body.checked;
        if (userId) {
            User.update({"userId": userId, "cartList.productId": productId},
                {
                    "cartList.$.productNum": productNum,
                    "cartList.$.checked": checked,
                }, function (err, doc) {
                    if (err) {
                        res.json({
                            code: '1',
                            msg: err.message,
                            data: ''
                        });
                    } else {
                        res.json({
                            code: '0',
                            msg: 'success',
                            data: ''
                        });
                    }
                })
        }
    },
    // 全选
    checkAll: function (req, res, next) {
        var userId = req.cookies.userId,
            checkAll = req.body.checkAll ? 1 : 0;
        User.findOne({userId: userId}, function (err, doc) {
            if (err) {
                res.json({
                    code: '0',
                    msg: err.message,
                    data: ''
                })
            } else {
                if (doc) {
                    doc.cartList.forEach(item => {
                        item.checked = checkAll
                    })
                    doc.save(function (err1, doc) {
                        if (err1) {
                            res.json({
                                code: '1',
                                msg: err1.message,
                                data: ''
                            });
                        } else {
                            res.json({
                                code: '0',
                                msg: 'success',
                                data: ''
                            });
                        }
                    })
                }
            }
        })
    },
    // 删除购物车
    delCart: function (req, res, next) {
        var userId = req.cookies.userId,
            productId = req.body.productId;
        if (userId && productId) {
            User.findOne({userId: userId}, function (error, doc) {
                if (error) {
                    res.json({
                        code: '1',
                        msg: error.message
                    })
                } else {
                    User.update({userId: userId},
                        {
                            $pull: {'cartList': {'productId': productId}}
                        }, function (err, doc) {
                            if (err) {
                                res.json({
                                    code: '1',
                                    msg: err.message,
                                    data: ''
                                });
                            } else {
                                res.json({
                                    code: '0',
                                    msg: '删除购物车成功',
                                    data: ''
                                });
                            }
                        })
                }
            })
        } else {
            res.json({
                code: '1',
                msg: '缺少必要的参数'
            })
        }
    },
    /**
     * 批量删除购物车
     * @param req
     * @param res
     * @param next
     */
    batchDeleteCart: function (req, res, next) {
        var userId = req.cookies.userId,
            productId = req.body.productId;
        if (userId && productId) {
            User.findOne({userId: userId}, function (error, doc) {
                if (error) {
                    res.json({
                        code: '1',
                        msg: error.message
                    })
                } else {
                    if (Array.isArray(productId) && productId.length) {
                        productId.forEach(item => {
                            doc.cartList.forEach((value, i) => {
                                if (value.productId == item) {
                                    doc.cartList.splice(i, 1)
                                }
                            })
                        });
                        doc.save().then(result => {
                            res.json({
                                code: '0',
                                msg: '批量删除成功'
                            })
                        }).catch(res => {
                            res.json({
                                code: '1',
                                msg: '删除失败'
                            })
                        })
                    }
                }
            })
        } else {
            res.json({
                code: '1',
                msg: '缺少必要的参数'
            })
        }
    }
};

module.exports = CartController;