const interfaces = require("../../utils/urlconfig.js");
const util = require("../../utils/util.js");
const formatTime = util.formatTime;
const url = interfaces.domain;
const app = getApp();
Page({
  data: {
    currentData : 0,
    user: {},
    seller: {},
    height0: 200,//高度自适应：高度*个数
    height1: 200,//高度自适应：高度*个数
    height2: 200,//高度自适应：高度*个数
    orderList: [],
    orderList0: [],
    orderList1: [],
    orderList2: [],
    hiddenmodalput2: true,
    selectedIndex: 0,
    updatevalue: "",
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
    // app.globalData.orderlist = this.data.orderList;
    // wx.setStorageSync('orderlist', this.data.orderList);
    wx.request({
      url: url+'/users/orderlist',
      method: 'post',
      data: {"id":userid,"item":this.data.orderList},
      success: (res)=>{
        this.setData({
          user: res.data
        })
        console.log("交易完成后的user",this.data.user)
        //保存到全局
        app.globalData.user = this.data.user;
        app.globalData.orderlist = this.data.user.orderlist;
        wx.setStorageSync('user', this.data.user);
        wx.setStorageSync('orderlist', this.data.user.orderlist);
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
        // app.globalData.orderlist = this.data.user.orderlist;
        // wx.setStorageSync('seller', this.data.user);
        // wx.setStorageSync('orderlist', this.data.user.orderlist);
      }
    })
  },
  //确认送达
  changeState: function(e){
    let index = e.currentTarget.dataset.id;
    console.log(index);
    let temp = this.data.orderList1;//list1
    console.log(temp[index]);
    let id = temp[index].id;
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
    arr[zongindex].state=2;
    //删掉
    this.setData({
      orderList1: temp,
      orderList: arr,
    })
    console.log("送达后的",this.data.orderList1,this.data.orderList)
    console.log("参数",userid,sellerid);
    // app.globalData.orderlist = this.data.orderList;
    // wx.setStorageSync('orderlist', this.data.orderList);
    wx.request({
      url: url+'/users/orderlist',
      method: 'post',
      data: {"id":userid,"item":this.data.orderList},
      success: (res)=>{
        this.setData({
          user: res.data
        })
        console.log("交易完成后的user",this.data.user)
        //保存到全局
        app.globalData.user = this.data.user;
        app.globalData.orderlist = this.data.user.orderlist;
        wx.setStorageSync('user', this.data.user);
        wx.setStorageSync('orderlist', this.data.user.orderlist);
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
        // app.globalData.orderlist = this.data.user.orderlist;
        // wx.setStorageSync('seller', this.data.user);
        // wx.setStorageSync('orderlist', this.data.user.orderlist);
      }
    })
  },
  //评论弹出层
  cancel2: function(){
    this.setData({
        hiddenmodalput2: true
    });
  },
  //编辑获取输入
  updateinput: function(e){
    let val = e.detail.value;
    this.setData({
      updatevalue: val
    })
  },
  //编辑确认
  confirm2: function(){
    let index = this.data.selectedIndex;
    console.log(index);
    let temp = this.data.orderList2;//list2
    console.log(temp[index]);
    let id = temp[index].id;
    let sellerid = temp[index].sellerid;
    let userid = temp[index].userid;
    let zongindex = 0; //在大list中的index
    let arr = this.data.orderList;
    this.data.orderList.some((item,index)=>{
      if(item.id==id){
        zongindex = index
      }
    })
    temp[index].state=3;
    temp[index].comment = this.data.updatevalue;
    arr[zongindex].state=3;
    arr[zongindex].comment = this.data.updatevalue;
    //删掉
    this.setData({
      orderList1: temp,
      orderList: arr,
    })
    console.log("评论后的",this.data.orderList2,this.data.orderList)
    wx.request({
      url: url+'/users/orderlist',
      method: 'post',
      data: {"id":userid,"item":this.data.orderList},
      success: (res)=>{
        this.setData({
          user: res.data
        })
        console.log("交易完成后的user",this.data.user)
        //保存到全局
        app.globalData.user = this.data.user;
        app.globalData.orderlist = this.data.user.orderlist;
        wx.setStorageSync('user', this.data.user);
        wx.setStorageSync('orderlist', this.data.user.orderlist);
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
        // app.globalData.orderlist = this.data.user.orderlist;
        // wx.setStorageSync('seller', this.data.user);
        // wx.setStorageSync('orderlist', this.data.user.orderlist);
      }
    })
    //隐藏页面
    this.setData({
      hiddenmodalput2: true
    })
  },
  //发表评论
  comment: function(e){
    console.log("选中的index:",e.currentTarget.dataset.id);
    this.setData({
      hiddenmodalput2: !this.data.hiddenmodalput2,
      selectedIndex: e.currentTarget.dataset.id,
   })
  },
  onShow:function(){
    let temp = wx.getStorageSync('orderlist');
    let len = temp.length;
    //异步会出错吗，不能在循环中使用，得递归
    for(let i=0;i<len;++i){
      app.globalData.sellers.some((item,index)=>{
        if(item.id==temp[i].sellerid){
          temp[i].sellerimg = item.img;
        }
      })
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
    console.log("temp1",temp1)
    this.setData({
      orderList0: temp0,
      orderList1: temp1,
      orderList2: temp2,
      height0: 200*temp0.length,
      height1: 200*temp1.length,
      height2: 200*temp2.length,
    })
    console.log("list1",this.data.orderList1)
  },
  onLoad:function(){
    this.setData({
      user: wx.getStorageSync('user')
    })
    let temp = wx.getStorageSync('orderlist');
    //异步会出错吗，不能在循环中使用，得递归
    let len = temp.length;
    for(let i=0;i<len;++i){
      app.globalData.sellers.some((item,index)=>{
        if(item.id==temp[i].sellerid){
          temp[i].sellerimg = item.img;
        }
      })
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
    // console.log("xxx",this.data.orderList)
  },

})