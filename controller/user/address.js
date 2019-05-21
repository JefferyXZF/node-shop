// 收货地址
var uuidv4 = require('uuid/v4');

var User = require('../../models/users/users');

var AddressController = {
    // 获取地址
    getAddressList: function (req, res, next) {
        var userId = req.cookies.userId,
            addressId = req.body.addressId || ''; // 地址id
        if (userId) {
            User.findOne({userId: userId}, function (err, doc) {
                if (err) {
                    res.json({
                        code: '1',
                        msg: err.message,
                        data: ''
                    })
                } else {
                    if (doc) {
                        var addressList = doc.addressList;
                        if (addressId) {
                            addressList.forEach(item => {
                                if (item.addressId == addressId) {
                                    addressList = item
                                }
                            })
                        }
                        res.json({
                            code: '0',
                            msg: 'success',
                            data: addressList
                        })
                    } else {
                        res.json({
                            code: '1',
                            msg: '用户不存在',
                            data: ''
                        })
                    }


                }
            })
        }
    },
    // 添加地址
    addAddress: function (req, res, next) {
        var userId = req.cookies.userId,
            userName = req.body.userName,
            tel = req.body.tel,
            streetName = req.body.streetName,
            isDefault = req.body.isDefault || false;
        if (userId && userName && tel && streetName) {
            User.findOne({userId: userId}, function (err, doc) {
                if (err) {
                    res.json({
                        code: '1',
                        msg: err.message,
                        data: ''
                    })
                } else {
                    let addressList = doc.addressList;
                    if (isDefault) {
                        addressList.forEach((item, i) => {
                            item.isDefault = false;
                        })
                    }
                    addressList.push({
                        "addressId": uuidv4(),
                        userName: userName,
                        tel: tel,
                        streetName: streetName,
                        isDefault: isDefault
                    })
                    doc.save(function (err1, doc1) {
                        if (err1) {
                            res.json({
                                code: '1',
                                msg: err1.message,
                                data: ''
                            })
                        } else {
                            res.json({
                                code: '0',
                                msg: 'suc',
                                data: ''
                            })
                        }
                    })
                }
            })
        } else {
            res.json({
                code: '1',
                msg: '缺少必须参数',
                data: ''
            })
        }
    },
    // 更新地址
    updateAddress: function (req, res, next) {
        var userId = req.cookies.userId,
            addressId = req.body.addressId, // 地址id
            userName = req.body.userName,
            tel = req.body.tel,
            streetName = req.body.streetName,
            isDefault = req.body.isDefault || false;
        if (userId && addressId && userName && tel && streetName) {
            User.findOne({userId: userId}, function (err, userDoc) {
                if (err) {
                    res.json({
                        code: '1',
                        msg: err.message,
                        data: ''
                    })
                } else {
                    var addressList = userDoc.addressList;
                    if (isDefault) { // 如果修改了默认地址
                        addressList.forEach((item, i) => {
                            if (item.addressId === addressId) {
                                item.isDefault = true;
                                item.userName = userName;
                                item.tel = tel;
                                item.streetName = streetName;
                            } else {
                                item.isDefault = false;
                            }
                        })
                        // 保存数据
                        userDoc.save((err1, doc1) => {
                            if (err1) {
                                res.json({
                                    code: '1',
                                    msg: err1.message,
                                    data: ''
                                })
                            } else {
                                res.json({
                                    code: '0',
                                    msg: 'success',
                                    data: ''
                                })
                            }
                        })
                    } else {
                        User.update({
                            "addressList.addressId": addressId
                        }, {
                            "addressList.$.userName": userName,
                            "addressList.$.tel": tel,
                            "addressList.$.isDefault": isDefault,
                            "addressList.$.streetName": streetName
                        }, (err2, doc2) => {
                            if (err2) {
                                res.json({
                                    code: '0',
                                    msg: err2.message,
                                    data: ''
                                })
                            } else {
                                res.json({
                                    code: '0',
                                    msg: 'success',
                                    data: ''
                                })
                            }
                        })
                    }
                }
            })
        } else {
            res.json({
                code: '1',
                msg: '缺少必须参数',
                data: ''
            })
        }
    },
    // 删除收货地址
    delAddress: function (req, res, next) {
        var userId = req.cookies.userId,
            addressId = req.body.addressId;
        if (userId && addressId) {
            User.update({userId: userId}, {
                $pull: {
                    'addressList': {
                        'addressId': addressId
                    }
                }
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
                        msg: '删除收货地址成功',
                        data: ''
                    });
                }
            })
        } else {
            res.json({
                code: '1',
                msg: '缺少必须参数',
                data: ''
            })
        }
    }
};

module.exports = AddressController;