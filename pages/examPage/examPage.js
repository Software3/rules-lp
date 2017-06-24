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
            that.startTimer(that.data.leftTime);
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
   * 启动定时器
   */
  startTimer: function (leftTime) {
    var that = this;
    var hour = parseInt(leftTime.split(':')[0]);
    var minute = parseInt(leftTime.split(':')[1]);
    var second = parseInt(leftTime.split(':')[2]);

    second = second - 1;
    if (second == -1) {
      second = 59;
      minute = minute - 1;
    }
    if (minute == -1) {
      minute = 59;
      hour = hour - 1;
    }
    if (hour == -1) {
      // 说明已经倒计时结束，应该关闭计时器并自动交卷
      return;
    }

    // 渲染界面
    var leftTime = [hour, minute, second].map(that.formatNumber).join(':');
    that.setData({
      leftTime: leftTime,
    })
    setTimeout(function () {
      that.startTimer(that.data.leftTime);
    }, 1000);
  },
  /**
   * 工具函数，将各位数字格式化
   */
  formatNumber: function (n) {
    n = n.toString()
  return n[1] ? n : '0' + n
  }
})