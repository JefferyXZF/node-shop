// 用户订单
var uuidv4 = require('uuid/v4');

var User = require('./../../models/users/users');
var Goods = require('./../../models/goods/goods');
var Admin = require('./../../models/admin/admin');

var OrderController = {
    // 生成订单
    createOrder: function (req, res, next) {
        try {
            var order = req.body.order;
            var userId = req.cookies.userId;
            // 是否登录
            if (userId) {
                // 需要地址id 以及 订单价格
                if (order.length) {
                    User.findOne({userId: userId}, function (err, doc) {
                        if (err) {
                            res.json({
                                code: '1',
                                msg: err.message,
                                data: ''
                            });
                        } else {
                            if (doc) {
                                var orderList = []
                                var date = new Date().getTime();
                                var createDate=new Date(date).toLocaleString().replace(/\//g, "-");
                                order.forEach(item => {
                                    // 生成订单号
                                    var platform = '880088';
                                    var orderId = platform + uuidv4();
                                    var orderItem = {
                                        orderId: orderId,
                                        goods: item.goods,
                                        address: item.address,
                                        orderStatus: 1,
                                        createDate: createDate, // 下单时间
                                        payDate: '',    // 支付时间
                                        deliverDate: '', // 发货时间
                                        completeDate: '',   // 完成时间
                                        evaluateDate: '' // 评论时间
                                    };
                                    orderList.push({orderId: orderId, order: item.goods});
                                    doc.orderList.unshift(orderItem);
                                    // 创建订单成功后，从购物车中删除商品
                                    // if (doc.cartList && doc.cartList.length && (doc.cartList.indexOf(item.goods.productId) > -1)) {
                                    //     doc.cartList.splice(item.goods.productId, 1)
                                    // }
                                })
                                    // 创建订单
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
                                            msg: '创建订单成功',
                                            data: {
                                                address: order[0].address,
                                                orderList: orderList
                                            }
                                        });
                                    }
                                })
                            } else {
                                res.json({
                                    code: '1',
                                    msg: '用户信息不存在',
                                    data: ''
                                });
                            }
                        }
                    });
                } else {
                    res.json({
                        code: 0,
                        msg: '缺少必须参数',
                        data: ''
                    })
                }
            } else {
                res.json({
                    code: 1,
                    msg: '未登录',
                    data: ''
                })
            }
        } catch (err) {
            res.json({
                code: 1,
                msg: err.message,
                data: ''
            })
        }
    },
    // 查询订单
    getOrderList: function (req, res, next) {
        var userId = req.cookies.userId;
        if (userId) {
            try {
                User.findOne({userId: userId}, function (err, doc) {
                    if (doc) {
                        var orderList = doc.orderList,
                            msg = 'success';
                        if (orderList.length <= 0) {
                            msg = '该用户暂无订单'
                        }
                        res.json({
                            code: '0',
                            msg: msg,
                            data: orderList
                        })
                    } else {
                        res.json({
                            code: '1',
                            msg: "用户不存在",
                            data: ''
                        })
                    }
                });
            } catch (err) {
                res.json({
                    code: '1',
                    msg: err.message,
                    data: ''
                })
            }
        }
    },
    delOrder: function (req, res, next) {
        var userId = req.cookies.userId,
            orderId = req.body.orderId;
        if (userId) {
            if (orderId) {
                User.update({userId: userId}, {
                    $pull: {
                        'orderList': {
                            'orderId': orderId
                        }
                    }
                }, function(err, doc) {
                    if (err) {
                        res.json({
                            code: '1',
                            msg: err.message,
                            data: ''
                        })
                    } else {
                        res.json({
                            code: '0',
                            msg: '',
                            data: 'success'
                        });
                    }
                })
            } else {
                res.json({
                    code: '1',
                    msg: '缺少订单号',
                    data: ''
                })
            }
        } else {
            res.json({
                cope: '1',
                msg: '未登录',
                data: ''
            })
        }
    },
    getOrderDetail: function (req, res, next) { // 订单详情
        var userId = req.cookies.userId,
            orderId = req.body.orderId;
        if (userId) {
            try {
                User.findOne({userId: userId}, function (err, doc) {
                    if (doc && orderId) {
                        var orderList = doc.orderList;
                        if ( orderList && orderList.length) {
                            var order = orderList.filter((item) => orderId.indexOf(item.orderId) > -1);
                            if (order.length) {
                                res.json({
                                    code: '0',
                                    msg: 'success',
                                    data: order[0]
                                })
                            } else {
                                res.json({
                                    code: '0',
                                    msg: '没有数据',
                                    data: ''
                                })
                            }
                        }
                    } else {
                        res.json({
                            code: '1',
                            msg: "订单不存在",
                            data: ''
                        })
                    }
                });
            } catch (err) {
                res.json({
                    code: '1',
                    msg: err.message,
                    data: ''
                })
            }
        } else {
            res.json({
                cope: '1',
                msg: '未登录',
                data: ''
            })
        }
    },
    updateOrderState: function (req, res, next) {
        var userId = req.cookies.userId;
        var orderId = req.body.orderId;
        var productId = req.body.productId;
        var status = Number(req.body.status);
        if (userId) {
            var date = new Date().getTime();
            var createDate=new Date(date).toLocaleString().replace(/\//g, "-");
            try {
                User.findOne({userId: userId}, async function (err, doc) {
                    if (status == 2) { // 支付密码和登录密码一样，如果不相同则不能支付
                        var password = req.body.password;
                        if (password != doc.userPwd) {
                            res.json( {
                                code: '1',
                                msg: '支付密码错误',
                                data: ''
                            });
                            return;
                        }
                    }
                    if (doc && orderId) {
                        switch (status) {
                            case 0:
                                updateStatus(userId, orderId, status, createDate);
                                break;
                            case 2:
                                await updateStatus(userId, orderId, status, createDate);
                                var productNum = req.body.productNum; //商品支付数量
                                var goods = await Goods.findOne({productId: productId});
                                if (goods.salesVolume) {
                                    goods.salesVolume += productNum;
                                } else {
                                    goods.salesVolume = productNum;
                                }
                                goods.save();
                                break;
                            case 3:
                                updateStatus(userId, orderId, status, createDate);
                                break;
                            case 4:
                                updateStatus(userId, orderId, status, createDate);
                                break;
                            case 5:
                                var curStart = req.body.cur;
                                var content = req.body.introduction;
                                await updateStatus(userId, orderId, status, createDate);
                                Goods.update({ // 添加商品评论
                                    'productId': productId
                                }, {
                                    '$push': {
                                        content: {
                                            userName: doc.userName, //用户名
                                            curStart: curStart, // 评星
                                            description: content,   // 评论内容
                                            time: createDate    // 评论时间
                                        }
                                    }
                                }, function(err, data) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(data);
                                    }
                                });
                                break;
                        }
                        res.json({
                            code: '0',
                            msg: '更改订单状态成功'
                        })
                    } else {
                        res.json({
                            code: '1',
                            msg: "订单不存在",
                            data: ''
                        })
                    }
                });
            } catch (err) {
                res.json({
                    code: '1',
                    msg: err.message,
                    data: ''
                })
            }
        } else {
            res.json({
                cope: '1',
                msg: '未登录',
                data: ''
            })
        }
    },
    /**
     * 批量支付
     * @param req
     * @param res
     * @param next
     */
    batchUpdateOrder: async function(req, res, next) {
        var userId = req.cookies.userId;
        var orderId = req.body.orderId;
        var status = Number(req.body.status);
        if (userId && Array.isArray(orderId)) {
            var date = new Date().getTime();
            var createDate=new Date(date).toLocaleString().replace(/\//g, "-");
            try {
                var user = await User.findOne({userId: userId});
                if (status == 2) { // 支付密码和登录密码一样，如果不相同则不能支付
                    var password = req.body.password;
                    if (password != user.userPwd) {
                        res.json({
                            code: '1',
                            msg: '支付密码错误',
                            data: ''
                        });
                        return;
                    }
                }
                user.orderList.forEach(item => {
                    if (Array.isArray(orderId)) { // 判断订单是否是数组
                        if (orderId.includes(item.orderId)) {
                            item.orderStatus = 2;
                            item.payDate = createDate
                        }
                    } else {
                        if (item.orderId.index(orderId) > -1) {
                            item.orderStatus = 2;
                            item.payDate = createDate
                        }
                    }
                });
                // 下面一句很重要，如果不加即使修改了，不过也无效，数据库没有改变
                user.markModified('orderList'); // 嵌套对象修改
                user.save().then(result => {
                    res.json({
                        code: '0',
                        msg: 'success'
                    })
                }).catch(error => {
                    res.json({
                        code: '0',
                        msg: 'failed'
                    })
                })
            } catch (err) {
                res.json({
                    code: '1',
                    msg: err.message,
                    data: ''
                })
            }
        } else {
            res.json({
                cope: '1',
                msg: '未登录',
                data: ''
            })
        }
    },
    /**
     * 管理后台查询所有订单
     * @param req
     * @param res
     * @param next
     */
    manageOrder: function (req, res, next) {
        var adminId = req.cookies.adminId;
        Admin.findOne({'adminId': adminId}, function (err, doc) {
            if (err) {
                res.json({
                    code: '404',
                    msg: err.message
                })
            } else {
                if (doc) {
                    User.find({}, function (err, doc) {
                        if (err) {
                            res.json({
                                code: '0',
                                msg: err.msg
                            })
                        } else {
                            var orderList = [];
                            doc.forEach(item => {
                                orderList.push(...item.orderList)
                            })
                            res.json({
                                code: '0',
                                msg: 'success',
                                data: orderList
                            })
                        }
                    })
                }else {
                    res.json({
                        code: "1",
                        msg: "你没有权限修改",
                        data: ""
                    })
                }
            }
        })
    },
    /**
     * 管理后台修改订单状态
     * @param req
     * @param res
     * @param next
     */
    manageUpdateOrderStatus: function (req, res, next) {
        var adminId = req.cookies.adminId;
        var userName = req.body.userName;
        var orderId = req.body.orderId;
        var status = req.body.status;
        Admin.findOne({'adminId': adminId}, function (err, doc) {
            if (err) {
                res.json({
                    code: '404',
                    msg: err.message
                })
            } else {
                if (doc) {
                    if (orderId && userName) {
                        User.update(
                            {'orderList.orderId': orderId},
                            {'$set': {'orderList.$.orderStatus': status}},
                            function (errs, model) {
                                if (errs) {
                                    res.json({
                                        code: '1',
                                        msg: err.msg
                                    })
                                } else {
                                    if (model.nModified && model.nModified > 0) {
                                        res.json({
                                            code: '0',
                                            msg: '更改订单状态success'
                                        })
                                    } else {
                                        res.json({
                                            code: '1',
                                            msg: '更改订单状态失败'
                                        })
                                    }
                                }
                            });
                    } else {
                        res.json({
                            code: '1',
                            msg: '缺少订单参数或用户'
                        })
                    }
                }else {
                    res.json({
                        code: "1",
                        msg: "没有修改权限",
                        data: ""
                    })
                }
            }
        })
    },
    /**
     * 管理后台删除订单
     * @param req
     * @param res
     * @param next
     */
    managerDeleteOrder: function (req, res, next) {
        var adminId = req.cookies.adminId;
        var orderId = req.body.orderId;
        Admin.findOne({'adminId': adminId}, function (err, doc) {
            if (err) {
                res.json({
                    code: '404',
                    msg: err.message
                })
            } else {
                if (doc) {
                    if (orderId) {
                        User.update({'orderList.orderId': orderId}, {
                            $pull: {
                                'orderList': {
                                    'orderId': orderId
                                }
                            }
                        }, function(err, doc) {
                            if (err) {
                                res.json({
                                    code: '1',
                                    msg: err.message,
                                    data: ''
                                })
                            } else {
                                res.json({
                                    code: '0',
                                    msg: '',
                                    data: 'success'
                                });
                            }
                        })
                    } else {
                        res.json({
                            code: '1',
                            msg: '缺少订单参数'
                        })
                    }
                }else {
                    res.json({
                        code: "1",
                        msg: "没有权限",
                        data: ""
                    })
                }
            }
        })
    },
    searchOrderByID: function (req, res, next) {
        var adminId = req.cookies.adminId;
        var orderId = req.body.orderId;
        Admin.findOne({'adminId': adminId}, function (err, doc) {
            if (err) {
                res.json({
                    code: '404',
                    msg: err.message
                })
            } else {
                if (doc) {
                    User.find({}, function (err, doc) {
                        if (err) {
                            res.json({
                                code: '0',
                                msg: err.msg
                            })
                        } else {
                            var orderList = [];
                            doc.forEach(item => {
                                orderList.push(...item.orderList)
                            });
                            var filterOrder = orderList.length && orderList.filter(item => item.orderId.indexOf(orderId) > -1)
                            res.json({
                                code: '0',
                                msg: 'success',
                                data: filterOrder
                            })
                        }
                    })
                } else {
                    res.json({
                        code: "1",
                        msg: "你没有权限修改",
                        data: ""
                    })
                }
            }
        })
    }
};

/**
 * 更改订单状态
 * @param userId 用户id
 * @param orderId 订单id
 * @param status 订单状态
 * @param time 时间
 */
function updateStatus (userId, orderId, status, time) {
    var params = {};
    params['orderList.$.orderStatus'] = status;
    switch (status) {
        case 2:
            params['orderList.$.payDate'] = time; // 支付
            break;
        case 3:
            params['orderList.$.deliverDate'] = time; // 发货
            break;
        case 4:
            params['orderList.$.completeDate'] = time; // 完成
            break;
        case 5:
            params['orderList.$.evaluateDate'] = time; // 评论
            break;
    }
    User.update({'userId': userId, 'orderList.orderId': orderId}, {'$set': params}, function (errs, model) {
        if (errs) {
            return false;
        } else {
            if (model.nModified && model.nModified > 0) {
                return true;
            } else {
                return false;
            }
        }
    });
}

module.exports = OrderController;