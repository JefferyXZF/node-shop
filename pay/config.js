var fs = require('fs');
var path = require('path');
module.exports = {

    /* 以下信息可以在https://openhome.alipay.com/platform/appManage.htm查到, 不过merchantPrivateKey需要您自己生成 */

    /* 应用AppID */
    "appid": "2016092500595535",

    /* 通知URL 接受支付宝异步通知需要用到  */
    "notifyUrl": "http://172.16.100.1:3210/pay/notifyUrl",

    /* 公钥 和 私钥 的填写方式 */
    // "testPrivateKey": "-----BEGIN RSA PRIVATE KEY-----\n" +
    //     "公钥或私钥内容..." +
    //     "\n-----END RSA PRIVATE KEY-----",

    /* 应用RSA私钥 请勿忘记 -----BEGIN RSA PRIVATE KEY----- 与 -----END RSA PRIVATE KEY-----  */
    // "merchantPrivateKey": fs.readFileSync(path.join(__dirname, "./pem/rsa_private_key.pem"), 'utf-8'),
    "merchantPrivateKey": "-----BEGIN RSA PRIVATE KEY-----\n" +
        "MIIEpQIBAAKCAQEAwiMrywNuk6mNpZ/mmACZcbdGC8ljBm+UzHrdvo8VC6Fp2sMbE/+EBBApkwxyPjGG3spHWJjCUrCUhvb6mPJCKGWGYwVDwUp2EPb9MOeaBilbzZOfOeoghhyJkVvgOdZjE4oS2Luwj7W1sdsteVwoYWPXMQIa1VRJnNbspg01Fp7bGjf0AaoUqUDM32CxcCt/PqJgksSPzsmrYEN/LAfgRX3mZsJ8knXgbBGPQBFaj2N2Y5QUhgGEK8bF5C0hObd0unNGBTj/Epl16okaQNnrtVqYmEWVWO7YtG4wFZW+iVmy1ur9hZH0KmS2lfmYK/DJ3GSTaQspqHLS/N7MRdtSEQIDAQABAoIBAGVkYRbib/oG78e0v4ZbqchOY/L79xABbsFs2isQJ3mvj82FYLsNFDHbDxuRwIji7QGmu6R2A+eT+b6Td0YyIINgotNMiJqG/SrXFF1aWIMnTp8Lnnls4hepB+A3D+ClK5Gk5zryq8AiswZ05kcf7qcOsfESnFkWcGvNhEMlWri4zInTOIFpKdBuoVWl9adOwSDy+WagO5hNmmOG47lFoIcbJbQY27V2+5vNaQ/QBdbjGVSRG94awbU+EGSlmh5tybAynCnfb/DPG8S7snUFNIB7AT9VuMOJIG2x9sCejrtj9jOQySPVGp/qsz0s31+klccLVqCAhlCcfKVRPXqtlpECgYEA+MDxVDOJwDwe0+PTzfg8WU1gOOxfmMNg85QZ122IMLJXGx2fzEyjTkt0SX6r0et8FyWdS/VH/g0Zuh1Nb/aXUW0pYP4utdv4fd54AIJ9Osi+0axgmb/Kswi3tb3cfEqskqztvh2nxtvse5WEWC/6FQh16gwotlh2d6UX8MbJnOMCgYEAx8rutei9bg2iXP4/h0E2fz84rvuOUtsdL++TLZ8iuF1sSQhYkhGv2+lwkepBUmEAlyjTB4RCdJ5Nv3+Bu3a0BFKr5m4T0OKg/pmjXvdbRgxLWN5/1SU6ftUR9fhtmnxJAuigzH1wL9eCd+nt/a8qwFlDnQnICuS+ABUbiBabG3sCgYEA3pJMnCltFJr2fmK4be+xl7na4bPlqVsP0YHvSUlQ9TltJO7xvyvHZtOuneAAPtiz9EYMox05qD/yiAuV8Rszs4C36HgmNUQ35+95cgNPp5xc2GCjIo5wAJdJQQ07Td7G4IpoQpZoO08mHkHe48Uxv0YNszfj6ZvnjBAlBqPnWz8CgYEAp8YX8xZAjLxSTfkLbA8tLmnutbJ078sklW5/j14FEAETv7iMeAz2OpurdjzbIcxnbIhRvgwoqjmNXHQ8gynJPaAWzmg9p7nILETkVgkt0oLcewJNIrYiiwNuE7nMgGBCB3lGHrJvlR1KaFw/CDsikWfkSWk/XTZ8/yC6f+tL0SUCgYEAqGsfK0XbGM4WZvVpaLzxQGoyOGpNHak48EzXnvkKRKNJQsObsP6lyr2JS0/sIL/APOEvzQf3ieOYNd2FNqnmaAcPumT7Li6Hh41D8dSgM3FjnMxQ93xVqlt4jchSS1Awt2JIrYbAzt6of2EmGfuMMFsqevJBpcxo/dH8IGXU3Yk=" +
        "\n-----END RSA PRIVATE KEY-----",
    /* 支付宝公钥 如果为注释掉会使用沙盒公钥 请勿忘记 -----BEGIN PUBLIC KEY----- 与 -----END PUBLIC KEY----- */
    // "alipayPublicKey": fs.readFileSync(path.join(__dirname, "./pem/rsa_public_key.pem"), 'utf-8'),

    /* 支付宝支付网关 如果为注释掉会使用沙盒网关 */
    "gatewayUrl": "https://openapi.alipaydev.com/gateway.do",
};