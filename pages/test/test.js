// test.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testInfo: {},
    funcTitle:["进入考试"]
  },
  // 事件驱动函数，开始考试
  doExam: function (event) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    var studentId = userInfo.studentId;
    var testId = that.data.testInfo.testId;
    var duration = that.data.testInfo.duration;
    wx.navigateTo({
      url: '../../pages/examPage/examPage?studentId=' + studentId +
        '&testId=' + testId + '&duration=' + duration,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://www.ltaoj.cn/rules/test/getTestInfo',
      method: 'get',
      success: function(res) {
        console.log(res.data);
        res.data.startTime = util.getDateTime(new Date(res.data.startTime));
        res.data.endTime = util.getDateTime(new Date(res.data.endTime));
        that.setData({
          testInfo: res.data,
        })
      },
      fail: function(res) {},
      complete: function(res) {},
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
  
  }
})