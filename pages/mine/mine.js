//mine.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function (event) {
    wx.navigateTo({
      // url: '../logs/logs'
      url: '../test/test'
    })
  },
  //事件处理函数，查看错题
  viewWrong: function (event) {

  },
  //事件处理函数，错题练习
  doWrong: function (event) {

  },
  //事件处理函数，查看成绩
  viewGrade: function (event) {
    
  },
  //事件处理函数，设置
  doSettings: function (event) {

  },
  //事件处理函数，登录
  doLogin: function (event) {

  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  onShareAppMessage: function () {
    return {
      title: '自定义分享标题',
      path: 'page/user?id=123'
    }
  }
})
