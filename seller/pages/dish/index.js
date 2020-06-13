const app = getApp();
const interfaces = require("../../utils/urlconfig.js");
const url = interfaces.domain;
Page({
  data: {
    id: "",
    seller: {},
    classify: [],
    dish: [],
    selectedId: 0,
    selectedIndex: 0,
  },
  onShow: function (options) {
    this.setData({
      id : wx.getStorageSync('openid'),
      seller : wx.getStorageSync('seller'),
      classify: app.globalData.classify,
      dish: app.globalData.dish,
    });

  },
  add: function(){
    wx.navigateTo({
      url: '../adddish/index',
    })
  },
  edit: function(e){
    console.log("编辑选中的index:",e.currentTarget.dataset.index);
    console.log("编辑选中的id:",e.currentTarget.dataset.id);
    this.setData({
      selectedId: e.currentTarget.dataset.id,
      selectedIndex: e.currentTarget.dataset.index,
    })
    let item = this.data.dish[this.data.selectedIndex];
    wx.navigateTo({
      url: '../updatedish/index?item='+JSON.stringify(item),
    })
  },
  delete: function(e){
    let index = e.currentTarget.dataset.index;
    console.log("编辑选中的index:",index);
    console.log("编辑选中的id:",e.currentTarget.dataset.id);
    let newarr = this.data.dish;
    newarr.splice(index,1);
    this.setData({
      selectedId: e.currentTarget.dataset.id,
      selectedIndex: e.currentTarget.dataset.index,
      dish: newarr,
   })
   console.log("删除后的dish数组",this.data.dish);
   wx.request({
     url: url+'/sellers/dish',
     method: 'post',
     data: {"id":this.data.id,"item":this.data.dish},
     success:(res)=>{
      //更新seller
      this.setData({
        seller: res.data
      });
      console.log("删除分类成功：",this.data.seller);
      //保存到全局
      app.globalData.dish = this.data.seller.dish;
      app.globalData.seller = this.data.seller;
      wx.setStorageSync('seller', this.data.seller);
    }
   })
  }
})