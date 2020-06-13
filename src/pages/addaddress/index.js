const app = getApp();
const interfaces = require("../../utils/urlconfig.js");
const url = interfaces.domain
Page({
    data: {
        id: "",
        user: "",
        index: 0,
        addresslist: [],
        formData: {},
        state: false,
    },
    statechange: function(){
      let s = this.data.state;
      this.setData({
        state: !s
      })
    },
    onShow() {
      this.setData({
        id : wx.getStorageSync('openid'),
        user : wx.getStorageSync('user'),
        addresslist: wx.getStorageSync('addresslist'),
      });
    },

    formSubmit: function (e) {
      //拼接
      let sel = {};
      sel.name = e.detail.value.name;
      sel.phone = e.detail.value.phone;
      sel.location = e.detail.value.location;
      sel.state = this.data.state;
      //遍历数组，改变对应的值，如果是默认，全设为普通false
      let temparr = this.data.addresslist;
      if(sel.state==true){
        temparr.forEach((item,index)=>{
          item.state = false;
        })
      }
      temparr.push(sel);
      this.setData({
        addresslist: temparr
      })
      console.log("新增元素后的addresslist数组:",this.data.addresslist);
      wx.request({
        url: url+'/users/address',
        method: 'post',
        data: {"id":this.data.id,"item":this.data.addresslist},
        success:(res)=>{
            //返回user
            this.setData({
              user: res.data,
            });
            console.log("新加地址成功：",this.data.user);
            //保存到全局
            app.globalData.addresslist = this.data.user.addresslist;
            app.globalData.user = this.data.user;
            wx.setStorageSync('user', this.data.user);
            wx.setStorageSync('addresslist', this.data.addresslist);
            //返回
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000
            });
            setTimeout(()=>{
              wx.navigateBack();
            },1000) 
        }
      })
    }
   
});
