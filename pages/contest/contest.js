// contest.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   * operation: 表示点击按钮时该执行的操作
   * 0表示执行报名竞赛
   * 1表示执行开始竞赛
   * 2表示执行继续竞赛
   * 3表示执行查看成绩
   * 4表示执行未开始提示
   * 5表示执行竞赛结束提示
   */
  data: {
    contestInfo: {},
    btnText: '未登录',
    isShowTip: false,
    operation: 0,
    tipText: '竞赛未开始，请留意竞赛开始时间',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    var that = this;
    // 请求竞赛信息
    if (that.data.contestInfo.name == null) {
      wx.request({
        url: 'https://www.ltaoj.cn/rules/test/getContestInfo',
        method: 'get',
        success: function (res) {
          res.data.startTime = util.getDateTime(new Date(res.data.startTime));
          res.data.endTime = util.getDateTime(new Date(res.data.endTime));
          that.setData({
            contestInfo: res.data,
          })
          that.checkContest();
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    that.checkContest();
  },

  /**
   * 工具函数, 获取用户竞赛状态 
   */
  checkContest: function () {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo') || undefined;
    var contestInfo = that.data.contestInfo;
    if (userInfo == undefined) return;
    // 如果还没有请求到contestInfo对象，那么500ms后再次调用此方法。
    if (contestInfo.testId == undefined) {
      setTimeout(that.checkContest, 500)
      return;
    }
    var json = {};
    json.testId = contestInfo.testId;
    // 判断是否可报名竞赛
    wx.request({
      url: 'https://www.ltaoj.cn/rules/test/getContestTime',
      data: JSON.stringify(json),
      header: {
        'content-type': 'application/json',
      },
      method: 'post',
      dataType: 'json',
      success: function(res) {
        var result = res.data.result;
        if(result == 'success') { // 在可报名时间段内
          json = {};
          json.studentId = userInfo.studentId;
          json.testId = contestInfo.testId;
          // 判断用户是否已报名
          wx.request({
            url: 'https://www.ltaoj.cn/rules/test/isRegisted',
            data: JSON.stringify(json),
            header: {
              'content-type': 'application/json',
            },
            method: 'post',
            dataType: 'json',
            success: function (res) {
              var contestregistion = res.data;
              var studentId = contestregistion.studentId;
              var status = contestregistion.status;
              var btnText = '';
              var operation = 0;
              // 没有竞赛报名记录
              if (studentId == undefined || studentId == 0) {
                btnText = '我要报名';
                operation = 0;
                that.setData({
                  btnText: btnText,
                  operation: operation,
                  tipText: '',
                  isShowTip: false,
                })
              } else {
                that.checkAfterRegist();
              }
              console.log(res.data);
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }else { // 不在可报名时间段内,提示竞赛结束或者执行查看成绩
          var btnText = '竞赛已结束';
          var operation = 5;
          var tipText = '您已错过本次竞赛';
          var isShowTip = true;
          that.setData({
            btnText: btnText,
            operation: operation,
            tipText: tipText,
            isShowTip: isShowTip,
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  
  /**
   * 普通函数
   */
  checkAfterRegist: function () {
    var that = this;
    var studentId = wx.getStorageSync('userInfo').studentId;
    var testId = that.data.contestInfo.testId;
    var json = {};
    json.studentId = studentId;
    json.testId = testId;
    wx.request({
      url: 'https://www.ltaoj.cn/rules/test/getContestStatus',
      data: JSON.stringify(json),
      header: {
        'content-type': 'application/json',
      },
      method: 'post',
      dataType: 'json',
      success: function(res) {
        var contestregistion = res.data;
        var studentId = contestregistion.studentId;
        var status = contestregistion.status;
        var btnText = '';
        var operation = 0;
        var tipText = '';
        var isShowTip = false;
        if (status == 0) {
          btnText = '未开始'
          operation = 4;
          tipText = '竞赛未开始，请留意竞赛开始时间';
          isShowTip = true;
        } else if (status == 1) {
          btnText = '开始竞赛'
          operation = 1;
        } else if (status == 2) {
          btnText = '查看成绩'
          operation = 3;
        }
        that.setData({
          btnText: btnText,
          operation: operation,
          tipText: tipText,
          isShowTip: isShowTip,
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 事件函数，执行具体操作
   */
  doAction: function (event) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo') || undefined;
    if (userInfo == undefined) {
      that.toLogin();
      return;
    }
    var operation = that.data.operation;
    if (operation == 0) {
      that.doRegist();
    } else if (operation == 1) {
      that.doContest();
    } else if (operation == 2) {
      // 继续考试
    } else if (operation == 3) {
      that.doViewContestGrade();
    } else if (operation == 4 || operation == 5) {
      // do nothing,only show tipText
    }
  },

  /**
   * 普通函数，报名竞赛
   */
  doRegist: function () {
    var that = this;
    var studentId = wx.getStorageSync('userInfo').studentId;
    var testId = that.data.contestInfo.testId;
    var json = {};
    json.studentId = studentId;
    json.testId = testId;
    wx.request({
      url: 'https://www.ltaoj.cn/rules/test/registContest',
      data: JSON.stringify(json),
      header: {
        'content-type': 'application/json',
      },
      method: 'post',
      dataType: 'json',
      success: function(res) {
        console.log(res.data);
        wx.showToast({
          title: '报名成功',
        })
        that.checkAfterRegist();
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 普通函数，开始竞赛
  doContest: function (event) {
    wx.navigateTo({
      url: '../../pages/contestPage/contestPage',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 普通函数，查看成绩
   */
  doViewContestGrade() {
    var that = this;
    var studentId = wx.getStorageSync('userInfo').studentId;
    var testId = that.data.contestInfo.testId;
    var json = {};
    json.studentId = studentId;
    json.testId = testId;
    wx.showNavigationBarLoading();
    wx.request({
      url: 'https://www.ltaoj.cn/rules/test/testRecordInfo',
      data: JSON.stringify(json),
      header: {
        'content-type': 'application/json',
      },
      method: 'post',
      dataType: 'json',
      success: function(res) {
        console.log(res.data);
        var data = res.data;
        wx.hideNavigationBarLoading();
        wx.redirectTo({
          url: '../../pages/testGrade/testGrade?startTime=' + data.startTime + '&submitTime=' + data.submitTime + '&score=' + data.score,
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 普通函数，跳转登录界面
   */
  toLogin: function () {
    wx.navigateTo({
      url: '../login/login?path=1',
    })
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