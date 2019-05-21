//定义管理员模式

var mongoose = require('mongoose');
var adminSchema = new mongoose.Schema({
    "adminId": String,
    "adminName": String,
    "adminPwd": String,
    "headPic": String
})
module.exports = mongoose.model("admin", adminSchema);