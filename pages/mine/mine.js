//mine.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
  },
  //事件处理函数
  bindViewTap: function (event) {
    var that = this;
    var userInfo = that.data.userInfo;
    if (userInfo == undefined || userInfo.username == undefined) return;
    wx.navigateTo({
      // url: '../logs/logs'
      url: '../editAccount/editAccount?studentId=' +  userInfo.studentId + '&username=' + userInfo.username +
      '&sex=' + (userInfo.sex == 1 ? '男' : '女') +
      '&school=' + userInfo.school +
      '&college=' + userInfo.college +
      '&clazz=' + userInfo.clazz
    })
    
  },
  //事件处理函数，查看错题
  viewWrong: function (event) {

  },
  //事件处理函数，错题练习
  doWrong: function (event) {
    wx.navigateTo({
      url: '../../pages/exercisePage/exercisePage',
    })
  },
  //事件处理函数，查看成绩
  viewGrade: function (event) {
    
  },
  //事件处理函数，设置
  doSettings: function (event) {

  },
  //事件处理函数，登录
  doLogin: function (event) {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  /**
   * 声明周期函数，onShow
   */
  onShow: function () {
    if (userInfo != null && !userInfo.equals({})) return;
    var userInfo = wx.getStorageSync('userInfo') || {};
    var that = this;
    that.setData({
      userInfo: userInfo,
    })
  },

  onShareAppMessage: function () {
    return {
      title: '自定义分享标题',
      path: 'page/user?id=123'
    }
  }
})
