// testGrade.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardTitle: '成绩单',
    btnText: '好的，我知道了',
    userInfo: {},
    duration: 0,
    score: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    var startTime = options.startTime;
    var submitTime = options.submitTime;
    var duration = util.getDiffMinute(startTime, submitTime);
    var score = options.score;
    var that = this;
    that.setData({
      userInfo: userInfo,
      duration: duration,
      score: score,
    })
  },
  /**
   * 事件函数，回退
   */
  doBack: function (event) {
    wx.navigateBack({
      delta: 1,
    })
  }
})