const interfaces = require("../../utils/urlconfig.js");
const util = require("../../utils/util.js");
const formatTime = util.formatTime;
const url = interfaces.domain;
const app = getApp();
Page({
  data: {
    currentData : 0,
    // user: {},
    seller: {},
    height0: 200,//高度自适应：高度*个数
    height1: 200,//高度自适应：高度*个数
    height2: 200,//高度自适应：高度*个数
    orderList: [],
    orderList0: [],
    orderList1: [],
    orderList2: [],
  },
  //获取当前滑块的index
  bindchange:function(e){
    const that  = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent:function(e){
    const that = this;

    if (that.data.currentData === e.target.dataset.current){
        return false;
    }else{

      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  //跳转到详情
  toOrderDetail: function(e){
    wx.navigateTo({
      url: '../orderdetail/index?id='+e.currentTarget.dataset.id,
    })
    console.log(e.currentTarget.dataset.id)
  },
  //取消订单
  cancelorder: function(e){
    let index = e.currentTarget.dataset.id;
    let temp = this.data.orderList0;//list0
    let id = temp[index].id;//id
    let sellerid = temp[index].sellerid;
    let userid = temp[index].userid;
    let zongindex = 0; //在大list中的index
    let arr = this.data.orderList;
    this.data.orderList.some((item,index)=>{
      if(item.id==id){
        zongindex = index
      }
    })
    temp.splice(index,1);
    arr.splice(zongindex,1);
    //删掉
    this.setData({
      orderList0: temp,
      orderList: arr,
    })
    console.log("取消订单后的",this.data.orderList0,this.data.orderList)
    console.log("参数",userid,sellerid);
    wx.request({
      url: url+'/users/orderlist',
      method: 'post',
      //其实不对，不能是orderList，应该是单一order
      data: {"id":userid,"item":this.data.orderList},
      success: (res)=>{
        console.log("交易完成后的user",res.data)
      }
    })
    wx.request({
      url: url+'/sellers/orderlist',
      method: 'post',
      data: {"id":sellerid,"item":this.data.orderList},
      success: (res)=>{
        this.setData({
          seller: res.data
        })
        console.log("交易完成后的seller",this.data.seller)
        //保存到全局
        app.globalData.seller = this.data.seller;
        app.globalData.orderlist = this.data.seller.orderlist;
        wx.setStorageSync('seller', this.data.seller);
        wx.setStorageSync('orderlist', this.data.seller.orderlist);
      }
    })
  },
  jiedan:function(e){
    let index = e.currentTarget.dataset.id;
    let temp = this.data.orderList0;//list0
    let id = temp[index].id;//id
    let sellerid = temp[index].sellerid;
    let userid = temp[index].userid;
    let zongindex = 0; //在大list中的index
    let arr = this.data.orderList;
    this.data.orderList.some((item,index)=>{
      if(item.id==id){
        zongindex = index
      }
    })
    temp[index].state=1;
    temp.splice(index,1);
    arr[zongindex].state=1;
    //更改
    this.setData({
      orderList0: temp,
      orderList: arr,
    })
    console.log("接单后的",this.data.orderList0,this.data.orderList)
    console.log("参数",userid,sellerid);
    wx.request({
      url: url+'/users/orderlist',
      method: 'post',
      //其实不对，不能是orderList，应该是单一order
      data: {"id":userid,"item":this.data.orderList},
      success: (res)=>{
        console.log("交易完成后的user",res.data)
      }
    })
    wx.request({
      url: url+'/sellers/orderlist',
      method: 'post',
      data: {"id":sellerid,"item":this.data.orderList},
      success: (res)=>{
        this.setData({
          seller: res.data
        })
        console.log("交易完成后的seller",this.data.seller)
        //保存到全局
        app.globalData.seller = this.data.seller;
        app.globalData.orderlist = this.data.seller.orderlist;
        wx.setStorageSync('seller', this.data.seller);
        wx.setStorageSync('orderlist', this.data.seller.orderlist);
      }
    })
  },
  //确认送达
  changeState: function(e){

  },
  //发表评论
  comment: function(e){

  },
  onShow:function(){
    let temp = wx.getStorageSync('orderlist');
    let len = temp.length;
    //异步会出错吗，不能在循环中使用，得递归
    for(let i=0;i<len;++i){
      temp[i].sellerimg = this.data.seller.img;
      //格式化时间  
      temp[i].formatdate = formatTime(temp[i].date);
    }
    
    this.setData({
      orderList: temp,
    })
    wx.setStorageSync('orderlist', this.data.orderList)
    // console.log("xxx",this.data.orderList)
    let temp0 = [];
    let temp1 = [];
    let temp2 = [];
    this.data.orderList.forEach((item,index)=>{
      if(item.state==0){
        temp0.push(item)
      }
      if(item.state==1){
        temp1.push(item)
      }
      if(item.state==2||item.state==3){
        temp2.push(item)
      }
    });
    this.setData({
      orderList0: temp0,
      orderList1: temp1,
      orderList2: temp2,
      height0: 200*temp0.length,
      height1: 200*temp1.length,
      height2: 200*temp2.length,
    })
    console.log("xxx",this.data.orderList)
  },
  onLoad:function(){
    this.setData({
      seller: wx.getStorageSync('seller')
    })
    this.setData({
      orderList: this.data.seller.orderlist,
    })
    let temp = this.data.orderList;
    //异步会出错吗，不能在循环中使用，得递归
    let len = temp.length;
    for(let i=0;i<len;++i){
          temp[i].sellerimg = this.data.seller.img;
          //格式化时间  
          temp[i].formatdate = formatTime(temp[i].date);
    }
    this.setData({
      orderList: temp,
    })
    wx.setStorageSync('orderlist', this.data.orderList)
    // console.log("xxx",this.data.orderList)
    let temp0 = [];
    let temp1 = [];
    let temp2 = [];
    this.data.orderList.forEach((item,index)=>{
      if(item.state==0){
        temp0.push(item)
      }
      if(item.state==1){
        temp1.push(item)
      }
      if(item.state==2||item.state==3){
        temp2.push(item)
      }
    });
    this.setData({
      orderList0: temp0,
      orderList1: temp1,
      orderList2: temp2,
    })
    console.log("xxx",this.data.orderList)
  },

})