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
    hasWrongTile: false,
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
        url: '../login/login?path=1',
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
        console.log(res.data);
        var data = res.data;
        var code = data.code;
        if (code == 57) return;
        var wrongTList = res.data.object;
        var size = wrongTList.length;
        var title = wrongTList[0];
        var index = 0;
        var answer = new Array(size);
        that.setData({
          wrongTList: wrongTList,
          title: title,
          index: index,
          answer: answer,
          size: size,
          hasWrongTile: true,
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
      var isFinish = that.checkAnswer(that.data.answer, that.data.size);
      if (isFinish) {
        wx.showModal({
          title: '温馨提示',
          content: '您已做完该组所有题目是否提交？',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '',
          confirmText: '确定',
          confirmColor: '#4285F5',
          success: function (res) {
            if (res.confirm) {
              var data = that.formatAnswer(that.data.wrongTList, that.data.answer);
              console.log(JSON.stringify({
                'account': {
                  'studentId': 3903150326,
                  'username': '李涛江',
                  'sex': 1,
                  'clazz': null,
                  'grade': null,
                  'college': null,
                  'school': null,
                },
                'titleList': data,
              }));
              wx.request({
                url: 'https://www.ltaoj.cn/rules/title/submit',
                data: JSON.stringify({
                  'account': {
                    'studentId': 3903150326,
                    'username': '李涛江',
                    'sex': 1,
                    'clazz': null,
                    'grade': null,
                    'college': null,
                    'school': null,
                  },
                  'titleList': data,
                }),
                header: {
                  'content-type': 'application/json',
                },
                method: 'post',
                dataType: 'json',
                success: function (res) {
                  console.log(res.data);
                  // 更新本地学习记录，时间
                  var todayMinutes = wx.getStorageSync('todayMinutes') || 0;
                  todayMinutes = todayMinutes + parseInt(that.data.hour) * 60 + parseInt(that.data.minute) + parseInt(that.data.second) / 60;
                  wx.setStorageSync('todayMinutes', todayMinutes);
                  // 页面重定向至结果页面
                  wx.redirectTo({
                    url: '../practiceResult/practiceResult',
                  })
                },
                fail: function (res) { },
                complete: function (res) { },
              })
            } else {
              return;
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '您还有题目没有做完，请做完题目后再提交',
          showCancel: false,
          cancelText: '',
          cancelColor: '',
          confirmText: '我知道了',
          confirmColor: '#4285F5',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
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
   * 格式化答案数据
   */
  formatAnswer: function (titleList, answer) {
    for (var i = 0; i < titleList.length; i++) {
      for (var j = 0; j < titleList[i].options.length; j++) {
        titleList[i].options[j].checked = 0;
      }
      titleList[i].options[answer[i] - 1].checked = 1;
    }
    return titleList;
  }
})