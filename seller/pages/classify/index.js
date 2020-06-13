const app = getApp();
const interfaces = require("../../utils/urlconfig.js");
const url = interfaces.domain;
Page({
  data: {
    id: "",
    seller:{},
    classify:[],
    hiddenmodalput:true,
    hiddenmodalput2: true,
    newvalue: "",
    updatevalue: "",
    selectedId: 0,
    selectedIndex: 0,
  },
  onLoad: function (options) {
    this.setData({
      id : wx.getStorageSync('openid'),
      seller : wx.getStorageSync('seller'),
      classify: app.globalData.classify
    });

  },
  add: function(){
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
   })
  },
  edit: function(e){
    console.log("编辑选中的index:",e.currentTarget.dataset.index);
    console.log("编辑选中的id:",e.currentTarget.dataset.id);
    this.setData({
      hiddenmodalput2: !this.data.hiddenmodalput2,
      selectedId: e.currentTarget.dataset.id,
      selectedIndex: e.currentTarget.dataset.index,
   })
  },
  delete: function(e){
    let index = e.currentTarget.dataset.index;
    console.log("编辑选中的index:",index);
    console.log("编辑选中的id:",e.currentTarget.dataset.id);
    let newarr = this.data.classify;
    newarr.splice(index,1);
    this.setData({
      selectedId: e.currentTarget.dataset.id,
      selectedIndex: e.currentTarget.dataset.index,
      classify: newarr,
   })
   console.log("删除后的classify数组",this.data.classify);
   wx.request({
     url: url+'/sellers/classify',
     method: 'post',
     data: {"id":this.data.id,"item":this.data.classify},
     success:(res)=>{
      //更新seller
      this.setData({
        seller: res.data
      });
      console.log("删除分类成功：",this.data.seller);
      //保存到全局
      app.globalData.classify = this.data.seller.classify;
      app.globalData.seller = this.data.seller;
      app.globalData.dish = this.data.seller.dish;
      wx.setStorageSync('seller', this.data.seller);
    }
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
  //添加确认
  confirm: function(){
    let len = this.data.classify.length;
    let lastid = this.data.classify[len-1].id;
    //新数组项
    let item = {};
    item.id = lastid+1;
    item.name = this.data.newvalue;
    //更新数组 
    this.setData({
      classify: this.data.classify.concat(item),
    });
    console.log("新增元素后的classify数组:",this.data.classify);
    //保存到数据库,返回新seller
    wx.request({
      url: url+'/sellers/classify',
      method: 'post',
      data: {"id":this.data.id,"item":this.data.classify},
      success:(res)=>{
        //更新seller
        this.setData({
          seller: res.data
        });
        console.log("新加分类成功：",this.data.seller);
        //保存到全局
        app.globalData.classify = this.data.seller.classify;
        app.globalData.seller = this.data.seller;
        app.globalData.dish = this.data.seller.dish;
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
    let index = this.data.selectedIndex;
    //新数组项
    let item = {};
    item.id = this.data.selectedId;
    item.name = this.data.updatevalue;
    //更新数组 
    let key = `classify[${index}]`;
    this.setData({
      [key]: item,
    });
    console.log("编辑元素后的classify数组:",this.data.classify);
    //保存到数据库,返回新seller
    wx.request({
      url: url+'/sellers/classify',
      method: 'post',
      data: {"id":this.data.id,"item":this.data.classify},
      success:(res)=>{
        //更新seller
        this.setData({
          seller: res.data
        });
        console.log("编辑分类成功：",this.data.seller);
        //保存到全局
        app.globalData.classify = this.data.seller.classify;
        app.globalData.seller = this.data.seller;
        app.globalData.dish = this.data.seller.dish;
        wx.setStorageSync('seller', this.data.seller);
      }
    })
    
    //隐藏页面
    this.setData({
      hiddenmodalput2: true
    })
  }
})