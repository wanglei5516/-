//app.js
const interfaces = require("./utils/urlconfig.js");
const url = interfaces.domain;
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        
       wx.request({
         url:'https://api.weixin.qq.com/sns/jscode2session?appid='+this.globalData.appid+'&secret='+this.globalData.secret+'&js_code='+code+'&grant_type=authorization_code',
         data:{},
         header:{
           'content-type': 'json'
         },
         success: (res)=>{
           var openid = res.data.openid;
           console.log('openid:'+openid);
           this.globalData.openid = openid;
           wx.setStorageSync('openid',openid);
           const that = this;
           //拿到openid，去数据库查找是否有商家
           wx.request({
            url: url+'/sellers',
            method: 'get',
            data:{
              id:openid
            },
            success:(res)=>{
              let seller = {};
              if(res.data.err_code!=0){
                seller = res.data
              }
              that.globalData.seller = seller;
              console.log('保存到全局',that.globalData.seller);
              wx.setStorageSync('seller',seller);
            }
           })
         },
         fail:(err)=>{
           console.log(err)
         }
       })
       console.log("缓存中openid",wx.getStorageSync('openid'));
       console.log("缓存中seller",wx.getStorageSync('seller'));
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    appid:'wxa07a2eebab1af108',
    secret:'6a57f49525e15b9298dbac846cc8abd3',
    openid:'',
    seller:{},
    classify:[],
    dish:[],
    orderlist: [],
  }
})