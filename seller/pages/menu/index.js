const app = getApp();
const interfaces = require("../../utils/urlconfig.js");
const url = interfaces.domain
Page({
  data:{
    id: '',
    seller: {},
    classify: [],
    dish: [],
    num: 0,//classify.id初始值
    toView: "dish0",//dish初始值
    all: [],
  },
  onShow: function(){
    console.log("加载进菜单了")
    if(wx.getStorageSync("openid")){
      this.setData({
        id : wx.getStorageSync('openid')
      })
    }
    if(wx.getStorageSync('seller')){
      this.setData({
        seller : wx.getStorageSync('seller')
      })
      app.globalData.seller = wx.getStorageSync('seller');
    }
    let len = Object.keys(this.data.seller).length;
    //内容为空的对象{}
    if(len===0){
        //提示
        wx.showToast({
          title: '您还未注册',
          icon: 'loading',
          duration: 100
        });
        //跳转
        setTimeout(function(){
          wx.navigateTo({
            url: '../index/index',
          })
        },100)
    }else{
      //初始化并排序
      let newcl = this.data.seller.classify;
      newcl.sort((a,b)=>{
        return a.id-b.id
      })
      let newdi = this.data.seller.dish;
      newdi.sort((a,b)=>{
        if(a.classify_id<b.classify_id){
          return -1
        }
        if(a.classify_id==b.classify_id){
          if(a.id<b.id) return -1
        }
      })
      this.setData({
        classify: newcl,
        dish: newdi,
      })
      let all = [];
      this.data.classify.forEach((item,index)=>{
        let obj = {};
        obj.id = item.id;
        obj.name = item.name;
        obj.dishes = [];
        for(let i=0;i<this.data.dish.length;++i){
          if(item.id===this.data.dish[i].classify_id){
            obj.dishes.push(this.data.dish[i])
          }
        }
        all.push(obj);
      })
      this.setData({
        all: all,
      })
      app.globalData.classify = this.data.seller.classify;
      app.globalData.dish = this.data.seller.dish;
      console.log("menu页面：",app.globalData.classify);
    }
  },
  changeclassify: function(e){
    //获取classify_id
    this.setData({
      num: e.target.dataset.id,
    })
    // let dishid = 0;
    // let flag = false;
    // for(let i=0;i<this.data.dish.length;++i){
    //   if(this.data.dish[i].classify_id===this.data.num){
    //     dishid = this.data.dish[i].id;
    //     flag = true;
    //     break;
    //   }
    // }
    // if(flag==false){

    // }
    this.setData({
      toView: "all"+this.data.num,
    })
    console.log(this.data.toView)
  },
  manageClassify:function(){
    wx.navigateTo({
      url: '../classify/index',
    })
  },
  manageDish: function(){
    wx.navigateTo({
      url: '../dish/index',
    })
  }
})