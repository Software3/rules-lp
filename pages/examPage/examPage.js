// examPage.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: 0,
    duration: 0,
    testRecord: {},
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
            var testRecord = res.data;
            var startTime = testRecord.startTime;
            var duration = that.data.duration;
            var fStartTime = util.getTime(new Date(startTime));
            // 字符串HH:mm:ss
            var timeDiff = util.timeDiff(new Date(), new Date(startTime + duration * 60 * 1000));
            that.setData({
              fStartTime: fStartTime,
              leftTime: timeDiff,
              testRecord: testRecord,
            })
            that.startTimer(that.data.leftTime);
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function(res) {
        console.log('fail')
      },
      complete: function(res) {
        console.log('complete')
      },
    })
  },

  /**
   * 事件函数，选择
   */
  doSelect: function (event) {
    var that = this;
    var answer = that.data.answer;
    var index = that.data.index;
    var id = parseInt(event.currentTarget.id);
    switch (id) {
      case 1:
        answer[index] = 1;
        break;
      case 2:
        answer[index] = 2;
        break;
      case 3:
        answer[index] = 3;
        break;
      case 4:
        answer[index] = 4;
        break;
    }
    that.setData({
      answer: answer,
    })
  },

  /**
   * 事件函数，上一题
   */
  doPrevTitle: function (event) {
    var that = this;
    var index = that.data.index;
    if (index == 0) return;
    var title = that.data.titleList[--index];
    that.setData({
      title: title,
      index: index,
    })
  },

  /**
   * 事件函数，下一题
   */
  doNextTitle: function (event) {
    var that = this;
    var index = that.data.index;
    if (index >= that.data.size - 1) {
      var isFinish = that.checkAnswer(that.data.answer, that.data.size);
      // 完成了全部答案
      if (isFinish) {
        // 标识用户是否取消了模态框
        var isCancel = false;
        wx.showModal({
          title: '温馨提示',
          content: '你已完成考试内容是否提交？',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '',
          confirmText: '确定',
          confirmColor: '#4285F5',
          success: function(res) {
            // 用户点击了模态框的确认按钮
            if (res.cancel) {
              isCancel = true;
            }
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '你还有题目未做完确定要提交吗',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '',
          confirmText: '确定',
          confirmColor: '#4285F5',
          success: function(res) {
            if (res.cancel) {
              isCancel = true;
            }
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }

      if (!isCancel){
        var data = [];
        var titleList = that.formatAnswer(that.data.titleList, that.data.answer);
        var testRecord = that.data.testRecord;
        data[0] = titleList;
        data[1] = testRecord;
        console.log(JSON.stringify(data));
        wx.request({
          url: 'https://www.ltaoj.cn/rules/test/submitTest',
          data: JSON.stringify(data),
          header: {
            'content-type': 'application/json',
          },
          method: 'post',
          dataType: 'json',
          success: function (res) {
            console.log(res.data);
          },
          fail: function (res) {
            console.log('failed');
          },
          complete: function (res) {
            console.log('complete');
          },
        })
      }
    } else {
      var title = that.data.titleList[++index];
      that.setData({
        title: title,
        index: index,
      })
    }
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
  },

    /**
   * 工具函数，检查该组试题是否已经做完
   */
  checkAnswer: function (answer, size) {
    if (answer.length < size) return false;
    for (var i = 0; i < answer.length; i++) {
      if (answer[i] == undefined) {
        return false;
      }
    }
    return true;
  },

  /**
   * 工具函数，格式化上传数据
   */
  formatAnswer: function (titleList, answer) {
    for (var i = 0; i < titleList.length; i++) {
      for (var j = 0; j < titleList[i].options.length; j++) {
        titleList[i].options[j].checked = 0;
      }
      if (answer[i] == undefined) continue;
      titleList[i].options[answer[i] - 1].checked = 1;
    }
    return titleList;
  }
})