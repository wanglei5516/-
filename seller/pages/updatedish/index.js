const app = getApp();
const interfaces = require("../../utils/urlconfig.js");
const url = interfaces.domain
Page({
    data: {
        id: "",
        seller: "",
        classify: [],
        newclassify: [],
        index: 0,
        dish: [],
        imgurl: "",
        formData: {},
        selectedid: 0,
        selectedindex: 0,
        initialname: "",
        initialprice: 0,
        initialimgurl: "",
        dishitem: {},
    },
    onLoad(options) {
      this.setData({
        id : wx.getStorageSync('openid'),
        seller : wx.getStorageSync('seller'),
        classify: app.globalData.classify,
        dish: app.globalData.dish,
      });
      let temp = [];
      this.data.classify.forEach((item,index)=>{
        temp.push(item.name)
      });
      this.setData({
        newclassify: temp,
      });
      let item = JSON.parse(options.item);
      let initalindex = 0;
      this.data.classify.forEach((i,index)=>{
        if(i.id==item.classify_id)
        initalindex = index
      })
      this.setData({
        initialname: item.name,
        initialprice: item.price,
        index: initalindex,
        imgurl: item.img,
      })
      //当前对象
      this.setData({
        dishitem: item
      })
    },
    bindPickerChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value);
      this.setData({
        selectedindex: e.detail.value,
        selectedid: this.data.classify[e.detail.value].id,
        index:e.detail.value
      })
    },
    formSubmit: function (e) {
      //拼接
      let item = this.data.dishitem
      item.name = e.detail.value.name;
      item.classify = this.data.classify[this.data.selectedindex].name;
      item.classify_id = this.data.selectedid;
      item.price = e.detail.value.price;
      item.img = this.data.imgurl;
      console.log("编辑后的元素",item)
      let temp = 0;
      this.data.dish.forEach((i,index)=>{
        if(i.id==item.id)
        temp = index;
      })
      let str = `dish[${temp}]`;
      this.setData({
        [str]: item,//变量方括号
      })
      console.log("编辑元素后的dish数组:",this.data.dish);
      wx.request({
        url: url+'/sellers/dish',
        method: 'post',
        data: {"id":this.data.id,"item":this.data.dish},
        success:(res)=>{
            //返回seller
            this.setData({
              seller: res.data,
            });
            console.log("编辑菜品成功：",this.data.seller);
            //保存到全局
            app.globalData.classify = this.data.seller.classify;
            app.globalData.seller = this.data.seller;
            app.globalData.dish = this.data.seller.dish;
            wx.setStorageSync('seller', this.data.seller);
            //返回
            wx.showToast({
              title: '编辑成功',
              icon: 'success',
              duration: 1000
            });
            setTimeout(()=>{
              wx.navigateBack();
            },1000)
              
            }
      })
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
      // var newurl = that.data.imgurl; 
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
});
