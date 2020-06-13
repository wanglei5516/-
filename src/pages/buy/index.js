const interfaces = require("../../utils/urlconfig.js");
const url = interfaces.domain;
const app = getApp();
Page({
  data: {
    inputvalue:"",
    imageurl1: "../../images/下箭头2.png",
    imageurl2: "../../images/上箭头2.png",
    sellers:[],
    exist: true,
  },
  bindinput: function(e) {
    this.setData({
      inputvalue: e.detail.value
    })
  },
  search: function(e) {
    if(this.data.inputvalue.length==0){
      this.setData({
        sellers: app.globalData.sellers,
        exist: true,
      })
      return;
    }
    let val = {};
    let finded = false;
    this.data.sellers.some((item,index)=>{
      if(item.name.indexOf(this.data.inputvalue)!=-1){
        val = item;
        finded = true;
      }
    })
    if(finded==true){
      this.setData({
        sellers: [val],
        exist: true,
      })
    }else{
      this.setData({
        // sellers: app.globalData.sellers,
        exist: false,
      })
      wx.showToast({  
        title: '未找到',    
        icon: 'loading',   
        duration: 500
      })
    }
    
    
  },
  choosesort: function(e) {
    //拿到sellers
  },
  choosesort1: function (e) {
    //sellers排序
  },
  choosesort2: function (e) {
    //sellers排序
  },
  onLoad: function (options) {
    //获取接口，返回sellers,调用choosesort
    wx.request({
      url:url+"/sellers",
      method:'get',
      success:(res)=>{
        this.setData({
          sellers:res.data,
        })
        console.log('商家列表：',res.data)
        app.globalData.sellers = res.data;
        wx.setStorageSync('sellers', res.data);
      },
    })
  },

})