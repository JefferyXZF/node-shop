//图片上传controller
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var UPLOAD_FOLDER = '/images/test';
var Img = {
    upload: function (req, res, next) {
        var form = new formidable.IncomingForm();   //创建上传表单
        var type = req.query.type;
        // 图片前缀名
        var prefixName = type === 'small' ? 'small' : type === 'big' ? 'big' : 'detail';
        // 时间戳
        var timestamp = new Date().getTime();
        form.encoding = 'utf-8';        //设置编辑
        form.uploadDir = 'public' + UPLOAD_FOLDER;     //设置上传目录
        form.keepExtensions = true;     //保留后缀
        form.maxFieldsSize = 10 * 1024 * 1024;   //文件大小
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

            var avatarName = prefixName + timestamp + '.' + extName;
            //图片写入地址；
            var newPath = form.uploadDir + '/' + avatarName;
            //显示地址；
            // var showUrl = domain + UPLOAD_FOLDER + avatarName;
            // console.log("newPath",newPath);
            fs.renameSync(files.file.path, newPath);  //重命名
            res.json({
                "code": "0",
                "imgPath":newPath
            });
        });
    },
    delete: function (req, res, next) {
        var url =  path.join(__dirname, './../../', req.body.imgUrl); // 单张图片删除
        var flag = fs.existsSync(url);
        if(flag) {    //判断给定的路径是否存在
            fs.unlinkSync(url);
            res.send({
                code: "0",
                msg: "删除成功"
            })
        }else{
            res.send({
                code: "1",
                msg: "路径不存在"
            })
        }
    },
    deleteBatch: function (req, res, next) {
        var detailUrl = req.body.detailUrl; // 批量删除富文本上传图片
        var smallUrl = req.body.smallUrl; //批量删除小图片
        var bigUrl = req.body.bigUrl; // 批量删除大图片
        if (detailUrl && detailUrl[0]) {
            delImgBatch(detailUrl);
        }
        if (smallUrl && smallUrl[0]) {
            delImgBatch(smallUrl);
        }
        if (bigUrl && bigUrl[0]) {
            delImgBatch(bigUrl);
        }
        res.send({
            code: "0",
            msg: "批量删除成功"
        })
    },
    //多图片上传
    multiPictureUpload: function (req, res, next) {
        var form = new formidable.IncomingForm();
        form.uploadDir = 'public' + WOMEN_FOLDER;   //文件保存在系统临时目录
        form.maxFieldsSize = 6 * 1024 * 1024;  //上传文件大小限制为最大6M
        form.keepExtensions = true;        //使用文件的原扩展名

        var targetDir = path.join(__dirname, './../../public/upload');
        // 检查目标目录，不存在则创建
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir);
        }
        _fileParse()
        // fs.access(targetDir, function(err){
        //     if(err){
        //         fs.mkdirSync(targetDir);
        //     }
        //     _fileParse();
        // });

        // 文件解析与保存
        function _fileParse() {
            form.parse(req, function (err, fields, files) {
                if (err) throw err;
                var filesUrl = [];
                var errCount = 0;
                var keys = Object.keys(files);
                keys.forEach(function(key){
                    var filePath = files[key].path;
                    var fileExt = filePath.substring(filePath.lastIndexOf('.'));
                    if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
                        errCount += 1;
                    } else {
                        //以当前时间戳对上传文件进行重命名
                        var fileName = 'detail' + new Date().getTime() + fileExt;
                        var targetFile = path.join(targetDir, fileName);
                        //移动文件
                        fs.renameSync(filePath, targetFile);
                        // 文件的Url（相对路径）
                        filesUrl.push('/upload/'+fileName)
                    }
                });

                // 返回上传信息
                res.json({filesUrl:filesUrl, success:keys.length-errCount, error:errCount});
            });
        }
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
        }else {
            res.send({
                code: "1",
                msg: "路径不存在"
            })
        }
    }
}
module.exports = Img;