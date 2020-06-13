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
    },
    onLoad() {
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
      let sel = {};
      sel.id = this.data.dish[this.data.dish.length-1].id+1;
      sel.name = e.detail.value.name;
      sel.classify = this.data.classify[this.data.selectedindex].name;
      sel.classify_id = this.data.selectedid;
      sel.price = e.detail.value.price;
      sel.img = this.data.imgurl;
      this.setData({
        dish: this.data.dish.concat(sel)
      })
      console.log("新增元素后的dish数组:",this.data.dish);
      wx.request({
        url: url+'/sellers/dish',
        method: 'post',
        data: {"id":this.data.id,"item":this.data.dish},
        success:(res)=>{
            //返回seller
            this.setData({
              seller: res.data,
            });
            console.log("新加菜品成功：",this.data.seller);
            //保存到全局
            app.globalData.classify = this.data.seller.classify;
            app.globalData.seller = this.data.seller;
            app.globalData.dish = this.data.seller.dish;
            wx.setStorageSync('seller', this.data.seller);
            //返回
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000
            });
            wx.navigateBack();
              
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
                // wx.uploadFile({
                //   url: url+'/sellers/dish/images', 
                //   filePath: this.data.files[0],
                //   name: 'file',
                //   formData: {
                //     'user': 'test'
                //   },
                //   success (res){
                //     const data = res.data;
                //     console.log(data)
                //     //do something
                //   }
                // })
            
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
