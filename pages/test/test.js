// test.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testInfo: {},
    btnText: '开始考试',
    clickable: true,
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // 请求考试信息
    if (that.data.testInfo.name == null) {
      wx.request({
        url: 'https://www.ltaoj.cn/rules/test/getTestInfo',
        method: 'get',
        success: function (res) {
          res.data.startTime = util.getDateTime(new Date(res.data.startTime));
          res.data.endTime = util.getDateTime(new Date(res.data.endTime));
          that.setData({
            testInfo: res.data,
          })
          that.checkExam();
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },

  // 事件驱动函数，开始考试
  doExam: function (event) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo') || undefined;
    if (userInfo == undefined) {
      that.toLogin();
      return;
    }
    var clickable = that.data.clickable;
    if (!clickable) return;
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

  // 判断用户是否正在考试
  checkExam: function () {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo') || undefined;
    var testInfo = that.data.testInfo;
    if (userInfo == undefined) return;
    if (testInfo.testId == undefined) {
      setTimeout(that.checkExam, 500);
      return;
    }
    var json = {};
    json.studentId = userInfo.studentId;
    json.testId = testInfo.testId;
    console.log(JSON.stringify(json));
    wx.request({
      url: 'https://www.ltaoj.cn/rules/test/testRecordInfo',
      data: JSON.stringify(json),
      header: {
        'content-type': 'application/json',
      },
      method: 'post',
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        var data = res.data;
        var startTime = data.startTime;
        var submitTime = data.submitTime;
        var btnText = '';
        var clickable = false;
        if (startTime == undefined) {
          btnText = '开始考试';
          clickable = true;
        } else if (submitTime == undefined) {
          btnText = '继续考试';
          clickable = true;
        } else {
          btnText = '已考试';
          clickable = false;
        }
        that.setData({
          btnText: btnText,
          clickable: clickable,
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 工具函数，跳转到登陆页面
  toLogin: function () {
    wx.navigateTo({
      url: '../login/login?path=1',
    })
  },
})