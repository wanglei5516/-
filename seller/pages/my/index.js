const app = getApp();
const interfaces = require("../../utils/urlconfig.js");
const url = interfaces.domain;
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    seller:{},
    hiddenmodalput:true,
    hiddenmodalput2: true,
    hiddenmodalput3: true,
    newvalue: "",
    updatevalue: "",
    locvalue: "",
  },
  //事件处理函数
  
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.setData({
      seller: app.globalData.seller
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //编辑
  edit: function(){
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
   })
  },
  edit2: function(){
    this.setData({
      hiddenmodalput2: !this.data.hiddenmodalput2,
   })
  },
  edit3: function(){
    this.setData({
      hiddenmodalput3: !this.data.hiddenmodalput3,
   })
  },
  cancel: function(){
    this.setData({
        hiddenmodalput: true
    });
  },
  cancel2: function(){
    this.setData({
        hiddenmodalput2: true
    });
  },
  cancel3: function(){
    this.setData({
        hiddenmodalput3: true
    });
  },
  //添加获取输入
  newinput: function(e){
    let val = e.detail.value;
    this.setData({
      newvalue: val
    })
  },
  //编辑获取输入
  updateinput: function(e){
    let val = e.detail.value;
    this.setData({
      updatevalue: val
    })
  },
  //编辑获取输入
  locinput: function(e){
    let val = e.detail.value;
    this.setData({
      locvalue: val
    })
  },
  //名字
  confirm: function(){
    //保存到数据库,返回新seller
    wx.request({
      url: url+'/sellers/name',
      method: 'post',
      data: {"id":this.data.seller.id,"item":this.data.newvalue},
      success:(res)=>{
        //更新seller
        this.setData({
          seller: res.data
        });
        //保存到全局
        app.globalData.seller = this.data.seller;
        wx.setStorageSync('seller', this.data.seller);
      }
    })
    
    //隐藏页面
    this.setData({
      hiddenmodalput: true
    })
  },
  //编辑确认
  confirm2: function(){
    //保存到数据库,返回新seller
    wx.request({
      url: url+'/sellers/phone',
      method: 'post',
      data: {"id":this.data.seller.id,"item":this.data.updatevalue},
      success:(res)=>{
        //更新seller
        this.setData({
          seller: res.data
        });
        //保存到全局
        app.globalData.seller = this.data.seller;
        wx.setStorageSync('seller', this.data.seller);
      }
    })
    
    //隐藏页面
    this.setData({
      hiddenmodalput2: true
    })
  },
  //地址确认
  confirm3: function(){
    //保存到数据库,返回新seller
    wx.request({
      url: url+'/sellers/location',
      method: 'post',
      data: {"id":this.data.seller.id,"item":this.data.locvalue},
      success:(res)=>{
        //更新seller
        this.setData({
          seller: res.data
        });
        //保存到全局
        app.globalData.seller = this.data.seller;
        wx.setStorageSync('seller', this.data.seller);
      }
    })
    
    //隐藏页面
    this.setData({
      hiddenmodalput3: true
    })
  },
})