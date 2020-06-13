const interfaces = require("../../utils/urlconfig.js");
const url = interfaces.domain;
const app = getApp();
Page({
  data:{
    cart:{},
    sel:{},
    id:'',
    classify:[],
    dish:[],
    price:0,
    all: [],
    num: 0,
    toView: "dish0",//dish初始值
  },
  changeclassify: function(e){
    //获取classify_id
    this.setData({
      num: e.target.dataset.id,
    })
    this.setData({
      toView: "all"+this.data.num,
    })
    console.log(this.data.toView)
  },

  onLoad: function(options){
    this.setData({
      id: options.id
    })
    console.log('该商家id：',options.id)
    wx.request({
      url:url+"/sellers?id="+options.id,
      method: 'get',
      success:(res)=>{
        this.setData({
          sel: res.data,
          classify: res.data.classify,
          dish: res.data.dish
        });
        app.globalData.classify = this.data.classify;
        app.globalData.dish = this.data.dish;
        app.globalData.seller = this.data.sel;
      
    
    //初始化并排序
    let newcl = this.data.classify;
    newcl.sort((a,b)=>{
      return a.id-b.id
    })
    let newdi = this.data.dish;
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
    app.globalData.classify = this.data.classify;
    app.globalData.dish = this.data.dish;
  },
});
  },
  //数字加1
  addNum: function(e){
    let id = e.currentTarget.dataset.id;
    let clid = e.currentTarget.dataset.classifyid;
    // var dishes = this.data.dish;
    let dishes = [];
    let ind = 0; //index
    //找到对应分类的dishes
    this.data.all.some((item,index)=>{
      if(item.id==clid){//等于分类id
        dishes = item.dishes;
        ind = index;
      }
    })
    let str = `all[${ind}].dishes`;
    dishes.some((item,index)=>{
      if(item.id==id){
        item.num++;
        this.setData({
          price:this.data.price+item.price,
          // dish:dishes,
          [str]:dishes,
        })
        
      }
    })
    // app.globalData.dish = dishes;
  },
  //数字减1
  minusNum: function(e) {
    let id = e.currentTarget.dataset.id;
    let clid = e.currentTarget.dataset.classifyid;
    // let dishes = this.data.dish;
    let dishes = [];
    //找到对应分类的dishes
    this.data.all.some((item,index)=>{
      if(item.id==clid){//等于分类id
        dishes = item.dishes;
      }
    })
    let str = `all[${clid}].dishes`;
    dishes.some((item,index)=>{
      if(item.id==id){//等于菜品id
        if( item.num>0 ){
          item.num--;
          this.setData({
            price:this.data.price-item.price,
            // dish:dishes,
            [str]:dishes,
          })
        } 
      }
    })
    // app.globalData.dish = dishes;
  },
  goOrder: function(){
    if(this.data.price==0){
      wx.showToast({  
        title: '请选择菜品',    
        icon: 'loading',   
        duration: 500
      })
      return;
    }
    var cart = [];
    this.data.dish.forEach((item,index)=>{
      if(item.num!=0){
        cart.push(item)
      }
    })
    wx.setStorageSync('cart', cart);
    wx.navigateTo({
      url: '../detail/index?sellerid='+this.data.id
    })
  }
})