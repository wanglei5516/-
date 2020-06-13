const interfaces = require("../../utils/urlconfig.js");
const url = interfaces.domain;
const app = getApp();
Page({
  data: {
    cart:[],
    seller:{},
    price: 0,
    hidden:true,
    user: {},
    addresslist: [],
    default: {},//默认地址
    hasDefault: false,//是否有默认值
  },
  toaddress:function(){
    wx.navigateTo({
      url: '../address/index',
    })
  },
  onShow: function(){
    this.setData({
      user: wx.getStorageSync('user'),
      addresslist: wx.getStorageSync('addresslist'),
    })
    console.log("当前已有地址列表",this.data.addresslist);
    //默认地址,先判断
    this.data.addresslist.some((item,index)=>{
      if(item.state==true){
        this.setData({
          hasDefault: true,
          default: item,
        })
      }
    })
  },
  onLoad: function (options) {

    this.setData({
      cart: wx.getStorageSync('cart'),
      user: wx.getStorageSync('user'),
      addresslist: wx.getStorageSync('addresslist'),
    })
    //其他
    var inital = 0;
    this.data.cart.forEach((item,index)=>{
      inital+=(item.num*item.price);
    })
    this.setData({
      price: inital
    })
    // 请求商家信息
    wx.request({
      url:url+"/sellers?id="+options.sellerid,
      method: 'get',
      success:(res)=>{
        this.setData({
          seller: res.data
        })
      }
    })
  },
  //数字加1
  addNum: function(e){
    var id = e.currentTarget.dataset.id;
    var dishes = this.data.cart;
    dishes.some((item,index)=>{
      if(item.id==id){
        item.num++;
        this.setData({
          price:this.data.price+item.price,
          cart:dishes
        })
      }
    })
    wx.setStorageSync('cart', this.data.cart);
  },
  //数字减1
  minusNum: function(e) {
    var id = e.currentTarget.dataset.id;
    var dishes = this.data.cart;
    dishes.some((item,index)=>{
      if(item.id==id){
        if( item.num>0 ){
          item.num--;
          if(item.num==0){
            dishes.splice(index,1)
          }
          this.setData({
            price:this.data.price-item.price,
            cart:dishes
          })
        } 
      }
    })
    wx.setStorageSync('cart', this.data.cart);
  },
  // 遮罩层
  paySuccess:function(){
    //生成订单
    let obj = {};
    obj.id = parseInt(Math.random(0,1)*1000000)//应该在数据库自增，懒得搞了
    obj.state = 0;
    obj.userid = app.globalData.user.id;
    obj.sellerid = this.data.seller.id;
    obj.fee = this.data.seller.fee;
    //obj.date = Date.now();//也应该在数据库处理
    obj.useradd = this.data.default;
    obj.selleradd = {"name":this.data.seller.name,"phone":this.data.seller.phone,"location":this.data.seller.location};
    obj.comment = "";
    obj.dish = this.data.cart;
    obj.price = this.data.price+this.data.seller.fee;
   
    if(Object.keys(obj.useradd).length==0){
      wx.showToast({  
        title: '请填写收货地址',    
        icon: 'loading',   
        duration: 500
      })
      return;
    }

    this.setData({
      'user.orderlist' : [obj].concat(this.data.user.orderlist),
      'seller.orderlist' : [obj].concat(this.data.seller.orderlist),
    })
    console.log("user.orderlist:",this.data.user.orderlist)
    console.log("seller.orderlist:",this.data.seller.orderlist)
    //保存到数据库,用户，商家
    wx.request({
      url: url+'/users/orderlist',
      method: 'post',
      data: {id:this.data.user.id,item:this.data.user.orderlist},
      success: (res)=>{
        this.setData({
          user: res.data
        })
        console.log("交易完成后的user",this.data.user)
        //保存到全局
        app.globalData.user = this.data.user;
        app.globalData.orderlist = this.data.user.orderlist;
        wx.setStorageSync('user', this.data.user);
        //交易成功，清空购物车
        wx.setStorageSync('cart', []);
        wx.setStorageSync('orderlist', this.data.user.orderlist);
      }
    })
    //保存到seller
    wx.request({
      url: url+'/sellers/orderlist',
      method: 'post',
      data: {id:this.data.seller.id,item:this.data.seller.orderlist},
      success: (res)=>{
        this.setData({
          seller: res.data
        })
        console.log("交易完成后的seller",this.data.seller)
        //保存到全局
        app.globalData.seller = this.data.seller;
        app.globalData.orderlist = this.data.seller.orderlist;
        wx.setStorageSync('user', this.data.user);
        //交易成功，清空购物车
        wx.setStorageSync('cart', []);
      }
    })
    this.setData({
      hidden: false
    })
  },
  //点击任意位置，取消掉，并跳转
  end: function(){
    wx.navigateBack({
      delta: 2 
    })
  }
})