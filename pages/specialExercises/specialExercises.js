// specialExercises.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hour: 0,
    minute: 0,
    second: 0,
    prevBtnText: '上一题',
    nextBtnText: '下一题',
    titleList: null,
    title: null,
    index: 0,
    size: 0,
    page: 1,
    answer: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 从缓存获取题目页数
    var titlePage = wx.getStorageSync('titlePage') || 1;
    wx.showNavigationBarLoading();
    wx.request({
      url: 'https://www.ltaoj.cn/rules/title/practice',
      data: {
        page: titlePage,
        count: 10
      },
      method: 'get',
      success: function (res) {
        var titleList = res.data.object;
        var title = titleList[0];
        var index = 0;
        var size = titleList.length;
        var answer = new Array(size);
        if(titleList != null && titleList.length > 0) {
          that.setData({
            titleList: titleList,
            title: title,
            index: 0,
            size: size,
            answer: answer,
          });
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '你已经完成了题库内容，是否要重新开始？',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '#4285F5',
            success: function(res) {
              if(res.confirm) {
                wx.setStorageSync("titlePage", 1);
                that.onLoad();  
              }
              if(res.cancel) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }
        wx.hideNavigationBarLoading();
      },
      fail: function (res) { 
        wx.navigateBack({
          delta: 1,
        })
      },
      complete: function (res) { 
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
    if(index == 0) return;
    var that = this;
    var title = that.data.titleList[--index];
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
    // 题目末尾，显示模态框，停止计时
    if(index >= that.data.size - 1) {
      var isFinish = that.checkAnswer(that.data.answer, that.data.size);
      if(isFinish) {
        wx.showModal({
          title: '温馨提示',
          content: '您已做完该组所有题目是否提交？',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '',
          confirmText: '确定',
          confirmColor: '#4285F5',
          success: function(res) {
            if (res.confirm) {
              var data = that.formatAnswer(that.data.titleList, that.data.answer);
              wx.request({
                url: 'https://www.ltaoj.cn/rules/title/submit',
                data: {
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
                },
                header: {
                  'content-type': 'application/json',
                },
                method: 'post',
                dataType: '',
                success: function(res) {
                  var titlePage = wx.getStorageSync('titlePage') || 1;
                  wx.setStorageSync("titlePage", ++titlePage);      
                },
                fail: function(res) {},
                complete: function(res) {},
              })
            } else {
              return;
            }
          },
          fail: function(res) {},
          complete: function(res) {},
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
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    }else {
      var title = that.data.titleList[++index];
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
    switch(id) {
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.startTimer(that.data.hour, that.data.minute,
      that.data.second);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    clearTimeout(that.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    that.data = null;
  },

  /**
   * 工具函数，开始计时
   */
  startTimer: function (hour, minute, second) {
    var that = this;
    // 将string转int
    hour = parseInt(hour);
    minute = parseInt(minute);
    second = parseInt(second);
    // 处理时间数值
    second = second + 1;
    if (second == 60) {
      second = 0;
      minute = minute + 1;
    }
    if (minute == 60) {
      minute = 0;
      hour = hour + 1;
    }
    // 将时间数值format
    hour = that.checkTime(hour);
    minute = that.checkTime(minute);
    second = that.checkTime(second);
    // 渲染页面
    that.setData({
      hour: hour,
      minute: minute,
      second: second,
    });
    
    setTimeout(function() {
      that.startTimer(that.data.hour, that.data.minute,     that.data.second);
    }, 1000);
  },

  /**
   * 工具函数，如果时间数值为个位数，则前边加0
   */
  checkTime: function (i) {
    if (i < 10) i = "0" + i.toString();
    return i;
  },
  /**
   * 工具函数，检查该组试题是否已经做完
   */
  checkAnswer: function (answer,size) {
    if (answer.length < size) return false;
    for(var i = 0;i < answer.length;i++) {
      if(answer[i] == undefined){
        return false;
      }
    }
    return true;
  },
  /**
   * 格式化答案数据
   */
  formatAnswer: function (titleList, answer) {
    for(var i = 0;i < titleList.length;i++) {
      for(var j = 0;j < titleList[i].options.length;j++) {
        titleList[i].options[j].checked = 0;
      }
      titleList[i].options[answer[i] - 1].checked = 1;
    }
    return titleList;
  }
})