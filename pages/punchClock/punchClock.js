// punchClock.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayHolder:"你今天的学习内容如下：",
    infoObjArray: [
      { id: 0, count: 0, title: '今日刷题/道' },
      { id: 1, count: 0, title: '今日学习/分' },
      { id: 2, count: 0, title: '共打卡/天' },
    ],
    placeholder:"请输入你的想法或者感受吧，最多140个字哦",
    gotoClock:"去打卡",
    waitClock:"学习会再来打卡",
    comment: '',
  },

  /**
   * 事件函数，打卡
   */
  doClock: function (event) {
    var that = this;
    var infoObjArray = that.data.infoObjArray;
    var json = {};
    json.studentId = 3903150326;
    json.titleNum = infoObjArray[0].count;
    json.duration = infoObjArray[1].count;
    json.comment = that.data.comment;
    json.clockDay = util.formatTime(new Date());
    wx.request({
      url: 'https://www.ltaoj.cn/rules/learn/clock',
      data: JSON.stringify(json),
      header: { 'content-type': 'application/json;charset:utf-8',},
      method: 'post',
      dataType: 'json',
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    
  },
  /**
   * 普通函数，返回
   */
  doBack: function (event) {
    wx.navigateBack({
      delta: 1,
    })
    // var json = {};
    // json.studentId = 3903150326;
    // json.username = '李涛江';
    // json.sex = 1;
    // json.clazz = null;
    // json.grade = null;
    // json.college = null;
    // json.school = null;
    // wx.request({
    //   url: 'https://www.ltaoj.cn/rules/learn/clockList',
    //   data: JSON.stringify(json),
    //   header: { 'Content-Type': 'application/json;charset:utf-8',},
    //   method: 'POST',
    //   dataType: 'json',
    //   success: function(res) {
    //     console.log(res);
    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  },
  
  /**
   * 输入框绑定事件
   */
  keyComment: function (event) {
    var that = this;
    that.setData({
      comment: event.detail.value,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var todayMinutes = wx.getStorageSync('todayMinutes') || 0;
    var todayTitleNum = wx.getStorageSync('todayTitleNum') || 0;
    console.log(todayMinutes + "***" + todayTitleNum);
    var that = this;
    var values = [todayTitleNum, todayMinutes, 0];
    var infoObjArray = that.data.infoObjArray;
    for (var i = 0; i < infoObjArray.length; i++) {
      infoObjArray[i].count = Math.round(values[i]);
    }
    that.setData({
      infoObjArray: infoObjArray,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  }
})