//上传图片路由

var express = require('express');
var router = express.Router();
var Img = require('./../controller/upload/img');

router.post('/img', Img.upload);
// router.post('/multiImg', Img.multiPictureUpload);
router.post('/delImg', Img.delete);
router.post('/batchDelImg', Img.deleteBatch);
module.exports =  router;