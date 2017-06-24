// exercisePage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wrongTList: [],
    title: {},
    answer: [],
    index: 0,
    size: 0,
    prevBtnText: '上一题',
    nextBtnText: '下一题',
  },

  /**
   * 生命周期函数--监听页面加载
   * 错题练习method:dowrong
   */
  onLoad: function (options) {
    var that = this;
    var account = wx.getStorageSync('userInfo') || null;
    if (account == undefined) {
      wx.navigateTo({
        url: '../login/login',
      })
    }
    var json = {};
    json.studentId = account.studentId;
    json.username = account.username;

    wx.showNavigationBarLoading();
    wx.request({
      url: 'https://www.ltaoj.cn/rules/title/wrongList',
      data: JSON.stringify(json),
      header: {
        'content-type': 'application/json',
      },
      method: 'post',
      dataType: 'json',
      success: function(res) {
        var wrongTList = res.data.object;
        var size = wrongTList.length;
        if(size == 0) return;
        var title = wrongTList[0];
        var index = 0;
        var answer = new Array(size);
        that.setData({
          wrongTList: wrongTList,
          title: title,
          index: index,
          answer: answer,
          size: size,
        })
      },
      fail: function(res) {},
      complete: function(res) {
        wx.hideNavigationBarLoading();
      },
    })
  },

  /**
   * 事件驱动函数，上一题
   */
  doPrevTitle: function (event) {
    var that = this;
    var index = that.data.index;
    if (index == 0) return;
    var title = that.data.wrongTList[--index];
    that.setData({
      title: title,
      index: index,
    })
  },

  /**
   * 事件驱动函数，下一题
   */
  doNextTitle: function (event) {
    var that = this;
    var index = that.data.index;
    if (index >= that.data.size - 1) {
      return;
    } else {
      var title = that.data.wrongTList[++index];
      that.setData({
        title: title,
        index: index,
      })
    }
  },
  /**
   * 选择A选项
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

})