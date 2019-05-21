// 用户管理
var uuidv4 = require('uuid/v4');
var fs = require('fs');
var path = require('path');
var User = require('./../../models/users/users');
var Goods = require('./../../models/goods/goods');
var formidable = require('formidable');

var UserController = {
    // 登录接口
    login: function (req, res, next) {
        var userName = req.body.userName;
        var userPwd = req.body.userPwd;
        User.findOne({
            userName: userName,
        }, function (err, doc) {
            if (err) {
                res.json({
                    code: '1',
                    msg: err.message,
                    data: ''
                })
            } else {
                if (doc) {
                    if (doc.userPwd === userPwd) {
                        var userId = doc.userId;
                        res.cookie("userId", userId, {
                            path: '/',
                            maxAge: 1000 * 60 * 60*24
                        });
                        res.json({
                            code: '0',
                            msg: '登陆成功',
                            data: ""
                        })
                    } else {
                        res.json({
                            code: '1',
                            msg: '密码错误，请重新输入',
                            data: ""
                        })
                    }

                } else {
                    res.json({
                        code: '1',
                        msg: '账号为空，请先注册',
                        data: ''
                    })
                }
            }
        })
    },
    // 登出接口
    logOut: function (req, res, next) {
        res.cookie("userId", "", {
            path: "/",
            maxAge: -1
        });
        res.json({
            code: "0",
            msg: '',
            data: ''
        })
    },
    // 注册帐号
    register: function (req, res, next) {
        var name = req.body.name;
        var userName = req.body.userName;
        var userPwd = req.body.userPwd;
        User.findOne({userName: userName}, function (err, doc) {
            if (err) {
                res.json({
                    code: "1",
                    msg: err.message
                })
            } else {
                if (doc) {
                    res.json({
                        code: '1',
                        msg: '账号已存在!',
                        data: ''
                    })
                } else {
                    // 可以注册
                    User.create({
                        userId: uuidv4(),
                        name: name,
                        userName: userName,
                        userPwd: userPwd,
                        headPic: '',
                        cartList: [],
                        orderList: [],
                        addressList: [],
                    })
                    res.json({
                        code: '0',
                        msg: '注册成功',
                        data: ''
                    })
                }
            }
        })
    },
    // 上传头像
    uploadHeadImage: function (req, res, next) {
        var userId = req.cookies.userId;
        var headPicPath = '';
        if (userId) {
            User.findOne({userId: userId}, async function (err, doc) {
                if (err) {
                    res.json({
                        code: '1',
                        msg: err.message,
                        data: ''
                    })
                } else {
                    if (doc) {
                        // 上传头像
                        try {
                            uploadHeadPic();
                            // 上传头像照片
                            function uploadHeadPic() {
                                var UPLOAD_FOLDER = '/images/user';
                                var form = new formidable.IncomingForm();   //创建上传表单
                                form.encoding = 'utf-8';        //设置编辑
                                form.uploadDir = 'public' + UPLOAD_FOLDER;     //设置上传目录
                                form.keepExtensions = true;     //保留后缀
                                form.maxFieldsSize = 1 * 1024 * 1024;   //文件大小
                                // 判断上传目录是否存在，不存在则创建目录
                                if (!fs.existsSync(form.uploadDir)) {
                                    fs.mkdirSync(form.uploadDir);
                                }
                                form.parse(req, function(err, fields, files) {

                                    if (err) {
                                        res.locals.error = err;
                                        res.send({"code": 0,"msg":"图片上传失败"});
                                        return;
                                    }
                                    var extName = '';  //后缀名
                                    switch (files.file.type) {
                                        case "image/pjpeg":
                                            extName = 'jpg';
                                            break;
                                        case "image/jpeg":
                                            extName = 'jpg';
                                            break;
                                        case "image/png":
                                            extName = 'png';
                                            break;
                                        case "image/x-png":
                                            extName = 'png';
                                            break;
                                    }

                                    if(extName.length == 0){
                                        res.locals.error = '只支持png和jpg格式图片';
                                        res.send({"code": 0,"msg":"只支持png和jpg格式图片"});
                                        return;
                                    }

                                    var avatarName = 'upload' + uuidv4() + '.' + extName;
                                    //图片写入地址；
                                    var newPath = form.uploadDir + '/' + avatarName;
                                    //显示地址；
                                    // var showUrl = domain + UPLOAD_FOLDER + avatarName;
                                    // console.log("newPath",newPath);
                                    fs.renameSync(files.file.path, newPath);  //重命名
                                    headPicPath = newPath;
                                    if (!headPicPath) {
                                        res.json({
                                            code: '1',
                                            msg: '上传头像失败'
                                        })
                                        return;
                                    }
                                    if (doc.headPic) {
                                        // 从本地删除原来的头像照片
                                        var url =  path.join(__dirname, './../../', doc.headPic); // 单张图片删除
                                        var flag = fs.existsSync(url);
                                        if(flag) {    //判断给定的路径是否存在
                                            fs.unlinkSync(url);
                                            console.log('删除图片成功');
                                        }else{
                                            console.log('删除上传头像路径不存在');
                                        }
                                    }
                                    doc.headPic = headPicPath;
                                    doc.save().then(result => {
                                        res.json({
                                            code: '0',
                                            msg: '上传头像成功',
                                            data: headPicPath
                                        })
                                    })
                                });
                            }
                        } catch (err) {
                            res.json({
                                code: '1',
                                msg: err.message
                            })
                        }

                    } else {
                        res.json({
                            code: 1,
                            msg: '未登录',
                            data: ''
                        })
                    }
                }
            })
        } else {
            res.json({
                code: '1',
                msg: '未登录'
            })
        }
    },
    // 获取用户信息
    getUserInfo: function (req, res, next) {
        var userId = req.cookies.userId;
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
                        res.json({
                            code: '0',
                            msg: '获取用户信息成功',
                            data: doc
                        })
                    } else {
                        res.json({
                            code: '1',
                            msg: '未登录',
                            data: ''
                        })
                    }
                }
            })
        } else {
            res.json({
                code: '1',
                msg: '未登录',
                data: ''
            })
        }
    },
    getCollectionList: function (req, res, next) { // 查询我的收藏
        var userId = req.cookies.userId;
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
                        if (doc.collectGoods && doc.collectGoods.length) {
                            Goods.find({productId: {$in: doc.collectGoods}}, function (err1, doc1) {
                                if (err) {
                                    res.json({
                                        code: '1',
                                        msg: err1.message,
                                        data: ''
                                    })
                                } else {
                                    res.json({
                                        code: '0',
                                        msg: 'success',
                                        data: doc1
                                    })
                                }
                            })
                        } else {
                            res.json({
                                code: '1',
                                msg: '无数据',
                                data: []
                            })
                        }
                    } else {
                        res.json({
                            code: '1',
                            msg: '未登录',
                            data: ''
                        })
                    }
                }
            })
        } else {
            res.json({
                code: '1',
                msg: '未登录',
                data: ''
            })
        }
    },
    doCollection: function (req, res, next) {
        var userId = req.cookies.userId;
        var productId = req.body.productId;
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
                        if (doc.collectGoods) {
                            if (doc.collectGoods.indexOf(productId) > -1) {
                                doc.collectGoods.splice(doc.collectGoods.indexOf(productId), 1)
                            } else {
                                doc.collectGoods.push(productId)
                            }
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
                                        data: doc.collectGoods || []
                                    });
                                }
                            })
                        }
                    } else {
                        res.json({
                            code: '1',
                            msg: '未登录',
                            data: ''
                        })
                    }
                }
            })
        } else {
            res.json({
                code: '1',
                msg: '未登录',
                data: ''
            })
        }
    }
};

module.exports = UserController;