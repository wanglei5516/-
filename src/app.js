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
           //拿到openid，去数据库查找是否有用户
           wx.request({
            url: url+'/users',
            method: 'get',
            data:{
              id:openid
            },
            success:(res)=>{
              let user = {};
              if(res.data.err_code!=0){
                user = res.data
              }
              that.globalData.user = user;
              that.globalData.orderlist = res.data.orderlist;
              that.globalData.addresslist = res.data.addresslist;
              console.log('保存到全局',that.globalData.user);
              wx.setStorageSync('user',user);
              wx.setStorageSync('orderlist', res.data.orderlist);
              wx.setStorageSync('addresslist', res.data.addresslist)
            }
           })
         },
         fail:(err)=>{
           console.log(err)
         }
       })
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
    sellers:[],
    user:{},
    seller:{},
    classify:[],
    dish:[],
    orderlist: [],
    addresslist: [],
  }
})