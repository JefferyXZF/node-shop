//管理员controller
var Admin = require('./../../models/admin/admin');
var Manager = {
    //登录
    login: function (req, res, next) {
        var param = {
            adminName: req.body.username
        };
        var password = req.body.password;
        Admin.findOne(param, function (err, doc) {
            if (err) {
                res.json({
                    code: '404',
                    msg: err.message
                })
            } else {
                if (doc) {
                    if (doc.adminPwd === password) {
                        res.json({
                            code: "0",
                            msg: "登录成功",
                            data: {
                                adminId: doc.adminId,
                                adminName: doc.adminName,
                                headPic: doc.headPic
                            }
                        })
                    }else {
                        res.json({
                            code: "1",
                            msg: "密码输入错误，请重新输入",
                            data: ""
                        })
                    }

                }else {
                    res.json({
                        code: "1",
                        msg: "用户不存在",
                        data: ""
                    })
                }
            }
        })
    },
    //退出登录
    logout: function (req, res, next) {
        var param = {
            adminId: req.param("adminId")
        };
        Admin.findOne(param, function (err, doc) {
            if (err) {
                res.json({
                    code: '404',
                    msg: err.message
                })
            } else {
                if (doc) {
                    res.json({
                        code: "0",
                        msg: "退出登录",
                        data: ""
                    })
                }else {
                    res.json({
                        code: "1",
                        msg: "退出失败",
                        data: ""
                    })
                }
            }
        })
    },
    //获取个人信息
    getInfo: function (req, res, next) {
        var param = {
            adminId: req.param("adminId")
        };
        Admin.findOne(param, function (err, doc) {
            if (err) {
                res.json({
                    code: '404',
                    msg: err.message
                })
            } else {
                if (doc) {
                    res.json({
                        code: "0",
                        msg: "成功",
                        data: {
                            adminId: doc.adminId,
                            adminName: doc.adminName,
                            headPic: doc.headPic
                        },
                        roles: ['admin']
                    })
                }else {
                    res.json({
                        code: "1",
                        msg: "获取用户信息失败",
                        data: ""
                    })
                }
            }
        })
    }
}

module.exports = Manager;