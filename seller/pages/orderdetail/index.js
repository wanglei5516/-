const interfaces = require("../../utils/urlconfig.js");
const url = interfaces.domain;
const app = getApp();
Page({
  data: {
    orderlist: [],
    order: {},
    user: {},
    cart: [],
  },
  onLoad: function (options) {

    this.setData({
      orderlist: wx.getStorageSync('orderlist'),
    })
    this.data.orderlist.forEach((item,index)=>{
        if(item.id==options.id){
          this.setData({
            order: item
          })
        }
    })
    this.setData({
      cart: this.data.order.dish
    })
    
  },
})