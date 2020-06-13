const app = getApp();
const interfaces = require("../../utils/urlconfig.js");
const url = interfaces.domain
Page({
  data:{
    seller: {},
    id: '',
    formData: {},
    imgurl: "",
    // rules: [{
    //   name: 'name',
    //   rules: {required: true, message: '名称必填'},
    // },{
    //   name: 'phone',
    //   rules: [{required: true, message: '电话必填'}, {phone: true, message: 'mobile格式不对'}],
    // },{
    //   name: 'address',
    //   rules: {required: true, message: '名称必填'},
    // }]
  },
  formSubmit: function (e) {
    let sel = {};
    sel.name = e.detail.value.name;
    sel.phone = e.detail.value.phone;
    sel.location = e.detail.value.address;
    sel.id = this.data.id;
    sel.img = this.data.imgurl;
    wx.request({
      url: url+'/sellers',
      method: 'post',
      data: sel,
      success:(res)=>{
        if(res.err_code!=1){
          //假菜单数据,一会删掉this.setdata
          this.setData({
            seller: res.data,
          });
          app.globalData.seller = this.data.seller;
          wx.setStorageSync('seller', this.data.seller)
          console.log('注册成功');
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000
          });
          //跳转
          setTimeout(function(){
            wx.navigateBack();
          },2000);
        }else{
          console.log('商家已存在，请勿重复注册！');
          wx.showModal({
            title: '提示',
            content: '商家已存在，请勿重复注册！',
            success: function(res) {
              if (res.confirm) {
              console.log('用户点击确定')
              } else if (res.cancel) {
              console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },
  onLoad: function(){
    console.log("menu获取到openid",wx.getStorageSync("openid"));
    if(wx.getStorageSync("openid")){
      this.setData({
        id : wx.getStorageSync('openid')
      })
    }
  },
  chooseImage: function (e) {
    var that = this;
    if(that.data.imgurl){
      wx.showToast({  
        title: '只能上传1张图片',    
        icon: 'loading',   
        duration: 500
      })
      return;
    }else{
      wx.chooseImage({
          count:1,
          sizeType: ['original', 'compressed'], 
          sourceType: ['album', 'camera'],
          success: function (res) {
              that.setData({
                  imgurl: res.tempFilePaths[0]
              });
              console.log("新图片路径",that.data.imgurl);
          }
      })
    }
},
previewImage: function(e){
    wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: [this.data.imgurl] // 需要预览的图片http链接列表
    })
},
updateImg: function (e) {  
  var that = this; 
  wx.chooseImage({
    count:1,
    sizeType: ['original', 'compressed'], 
    sourceType: ['album', 'camera'],
    success: function (res) {
        that.setData({
            imgurl: res.tempFilePaths[0]
        });
        console.log("新图片路径",that.data.imgurl);
    }
})
},
})