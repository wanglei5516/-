const domain = 'http://127.0.0.1:5000';
const domain2 = "https://www.thenewstep.cn"

const interfaces = {
  domain : 'http://127.0.0.1:5000',
  // 返回的首页请求的json数据
  // homepage: domain + '/api/users/homepage',

  // 返回的商品的json数据
  // sellers: domain + '/api/sellers',

  // 返回的商家列表的json数据
  sellerList: domain + '/api/sellers',

  // 返回的订单的json数据
  orderList: domain + '/api/users/orders',

  // 获取openid 参数: code appid secret
  getOpenid: domain + '/api/users/getOpenid/',

  // 微信支付
  // wechatPay: domain2 + '/xcxzf/jsapi.php',
};

module.exports = interfaces;
