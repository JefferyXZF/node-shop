var express = require('express');
var router = express.Router();
var alipayf2f = require('alipay-ftof');
var alipay_f2f = new alipayf2f(require("./config.js"));

router.post('/index', async function (req, res, next) {
    // 验证
    // alipay_f2f.checkInvoiceStatus("1231554823448470").then(result => {
    //     console.log(result);
    // }).catch(error => { });
    // 退款
    // alipay_f2f.refund("1231554823448470", refund).then(result => {
    //     result.should.have.property('code', '10000');
    // });

    alipay_f2f.createQRPay({
        tradeNo: "123" + new Date().getTime(),      // 必填 商户订单主键, 就是你要生成的
        subject: "女装",      // 必填 商品概要
        totalAmount: 0.5,    // 必填 多少钱
        body: "黑丝吊带小蜡烛", // 可选 订单描述, 可以对交易或商品进行一个详细地描述，比如填写"购买商品2件共15.00元"
        timeExpress: 5       // 可选 支付超时, 默认为5分钟
    }).then(result => {
        console.log(result) // 支付宝返回的结果
        res.json({
            code: '0',
            msg: 'success',
            data: result
        })
    }).catch(error => {
        console.error(error)
        res.json({
            code: '0',
            msg: 'success',
            data: error
        })
    });
})

router.post("/notifyUrl", function(req, res, next) {
    /* 请勿改动支付宝回调过来的post参数, 否则会导致验签失败 */
    var signStatus = alipay_f2f.verifyCallback(req.body);
    if(signStatus === false) {
        return res.error("回调签名验证未通过");
    }

    /* 商户订单号 */
    var noInvoice = req.body["out_trade_no"];
    /* 订单状态 */
    var invoiceStatus = req.body["trade_status"];

    // 支付宝回调通知有多种状态您可以点击已下链接查看支付宝全部通知状态
    // https://doc.open.alipay.com/docs/doc.htm?spm=a219a.7386797.0.0.aZMdK2&treeId=193&articleId=103296&docType=1#s1
    if(invoiceStatus !== "TRADE_SUCCESS") {
        return res.send("success");
    }

    /* 一切都验证好后就能更新数据库里数据说用户已经付钱啦 */
    // req.database.update(noInvoice, { pay: true }).then(result => res.send("success")).catch(err => res.catch(err));
});
router.get("/notifyUrl", function(req, res, next) {
    /* 请勿改动支付宝回调过来的post参数, 否则会导致验签失败 */
    var signStatus = alipay_f2f.verifyCallback(req.body);
    if(signStatus === false) {
        return res.error("回调签名验证未通过");
    }

    /* 商户订单号 */
    var noInvoice = req.body["out_trade_no"];
    /* 订单状态 */
    var invoiceStatus = req.body["trade_status"];

    // 支付宝回调通知有多种状态您可以点击已下链接查看支付宝全部通知状态
    // https://doc.open.alipay.com/docs/doc.htm?spm=a219a.7386797.0.0.aZMdK2&treeId=193&articleId=103296&docType=1#s1
    if(invoiceStatus !== "TRADE_SUCCESS") {
        return res.send("success");
    }

    /* 一切都验证好后就能更新数据库里数据说用户已经付钱啦 */
    // req.database.update(noInvoice, { pay: true }).then(result => res.send("success")).catch(err => res.catch(err));
});

module.exports = router;
