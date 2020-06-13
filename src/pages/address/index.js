const app = getApp();
const interfaces = require("../../utils/urlconfig.js");
const url = interfaces.domain;
Page({
  data: {
    id: "",
    user:{},
    addresslist:[],
    selectedIndex: 0,
  },
  onShow: function () {
    this.setData({
      id : wx.getStorageSync('openid'),
      seller : wx.getStorageSync('user'),
      addresslist: wx.getStorageSync('addresslist'),
    });

  },
  add: function(){
    wx.navigateTo({
      url: '../addaddress/index',
    })
  },
  edit: function(e){
    console.log("编辑选中的index:",e.currentTarget.dataset.index);
    this.setData({
      selectedIndex: e.currentTarget.dataset.index,
    })
    let item = this.data.addresslist[this.data.selectedIndex];
    wx.navigateTo({
      url: '../updateaddress/index?item='+JSON.stringify(item)+'&index='+this.data.selectedIndex,
    })
  },
  delete: function(e){
    let index = e.currentTarget.dataset.index;
    console.log("编辑选中的index:",index);
    let temparr = this.data.addresslist;
    temparr.splice(index,1);
    this.setData({
      selectedIndex: index,
      addresslist: temparr
    })
    console.log("删除后的addresslist数组：",this.data.addresslist);
    wx.request({
      url: url+'/users/address',
      method: 'post',
      data: {"id":this.data.id,"item":this.data.addresslist},
      success:(res)=>{
          //返回user
          this.setData({
            user: res.data,
          });
          console.log("删除地址成功：",this.data.user);
          //保存到全局
          app.globalData.addresslist = this.data.user.addresslist;
          app.globalData.user = this.data.user;
          wx.setStorageSync('user', this.data.user);
          wx.setStorageSync('addresslist', this.data.addresslist);
          //返回
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1000
          });
          //删除不用后退
      }
    })
  }
})