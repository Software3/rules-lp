// examPage.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: 0,
    duration: 0,
    fStartTime: '',
    leftTime: '',
    titleList: [],
    size: 0,
    index: 0,
    title: {},
    prevBtnText: '上一题',
    nextBtnText: '下一题',
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var duration = options.duration;
    that.setData({
      duration: duration,
    })
    var json = {};
    json.studentId = options.studentId;
    json.testId = options.testId;
    // 添加当前时间戳参数
    json.startTime = util.formatTime(new Date());
    // 请求试题
    wx.request({
      url: 'https://www.ltaoj.cn/rules/test/startTest',
      data: JSON.stringify(json),
      header: {
        'content-type': 'application/json',
      },
      method: 'post',
      dataType: 'json',
      success: function(res) {
        var titleList = res.data;
        var size = titleList.length;
        if (size == 0 ) return;
        var title = titleList[0];
        var index = 0;
        var answer = new Array(size);
        that.setData({
          titleList: titleList,
          size: size,
          title: title,
          index: index,
          answer: answer,
        })
        // 请求testInfo获取时间，启动计时器
        wx.request({
          url: 'https://www.ltaoj.cn/rules/test/testRecordInfo',
          data: JSON.stringify(json),
          header: {
            'content-type': 'application/json',
          },
          method: 'post',
          dataType: 'json',
          success: function (res) {
            var startTime = res.data.startTime;
            var duration = that.data.duration;
            var fStartTime = util.getTime(new Date(startTime));
            // json数组[day,hour,minute,second]
            var timeDiff = util.timeDiff(new Date(), new Date(startTime + duration * 60 * 1000 - 8 * 60 * 60 * 1000));
            that.setData({
              fStartTime: fStartTime,
              leftTime: timeDiff,
            })
          },
          fail: function (res) { },
          complete: function (res) { },
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