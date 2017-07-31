// specialExercises.js
var util = require('../../utils/util.js')
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
    titleList: [],
    title: [],
    index: 0,
    size: 0,
    page: 1,
    answer: [],
    titleType: 0,
    titlesStr: ['单选题', '填空题', '判断题', '简答题', '案例分析题', '论述题'],
    answerActionStr: '显示',
    isShowAnswer: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var titleType = parseInt(options.titleType);
    // 从缓存获取题目页数
    var titlePage = wx.getStorageSync('titlePage'+titleType) || 1;
    wx.showNavigationBarLoading();
    wx.request({
      url: 'https://www.ltaoj.cn/rules/title/practice',
      data: {
        page: titlePage,
        count: 10,
        type: titleType,
      },
      method: 'get',
      success: function (res) {
        var titleList = res.data.object;
        var title = titleList[0];
        var index = 0;
        var size = titleList.length;
        var answer = new Array(size);
        var fillsCount = that.data.fillsCount||[];
        if(titleList != null && titleList.length > 0) {
          if (titleType == 1) {
            for (var i = 0; i < titleList.length; i++) {
              if (titleList[i].name.match(/#/g) == undefined) {
                fillsCount = that.data.fillsCount;
              }
              var fillCount = titleList[i].name.match(/#/g).length;
              fillsCount[i] = [];
              for (var j = 1; j <= fillCount; j++) {
                fillsCount[i].push({ blankIdx: j, blankId: (1 + i) + "_" + j, row: (1 + i), col: j });
              }
              titleList[i].name = titleList[i].name.replace(/#/g, '______');
            }
          }
          that.setData({
            titleList: titleList,
            title: title,
            index: 0,
            size: size,
            answer: answer,
            titleType: titleType,
            fillsCount: fillsCount,
          });
        } else if (wx.getStorageSync('titlePage' + titleType) == '') {
          wx.showModal({
            title: '温馨提示',
            content: '暂没有该类型的题目,您可以先去练习其他类型题目',
            showCancel: false,
            cancelText: '',
            cancelColor: '',
            confirmText: '我知道了',
            confirmColor: '#4285F5',
            success: function(res) {
              wx.navigateBack({
                delta: 1,
              })
            },
            fail: function(res) {},
            complete: function(res) {},
          })
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
                wx.setStorageSync('titlePage'+titleType, 1);
                that.onLoad({titleType: titleType});
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
      if(isFinish||that.data.titleType!=0) {
        var url = 'https://www.ltaoj.cn/rules/learn/upClock';
        var content = '您已学习完本组题目是否提交？';
        if (that.data.titleType == 0) {
          url = 'https://www.ltaoj.cn/rules/title/submit';
          content = '您已做完该组所有题目是否提交？'
        }
        wx.showModal({
          title: '温馨提示',
          content: content,
          showCancel: true,
          cancelText: '取消',
          cancelColor: '',
          confirmText: '确定',
          confirmColor: '#4285F5',
          success: function(res) {
            if (res.confirm) {
              that.updateLearnTime();
              var userInfo = wx.getStorageSync('userInfo') || undefined;
              var data = {};
              if (that.data.titleType == 0) {
                var titleList = that.formatAnswer(that.data.titleList, that.data.answer);
                data = { account: userInfo, titleList: titleList };
              } else {
                var todayMinutes = wx.getStorageSync('todayMinutes') || 0;
                var todayTitleNum = wx.getStorageSync('todayTitleNum') || 0;
                data.studentId = userInfo.studentId;
                data.titleNum = todayTitleNum;
                data.duration = todayMinutes;
                data.clockDay = util.formatTime(new Date());
              }
              wx.request({
                url: url,
                data: JSON.stringify(data),
                header: {
                  'content-type': 'application/json',
                },
                method: 'post',
                dataType: 'json',
                success: function(res) {
                  // 页面重定向至结果页面
                  wx.redirectTo({
                    url: '../practiceResult/practiceResult?result=1&titleType='+that.data.titleType,
                  })
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
    if(i == undefined) i = 0;
    if ( i < 10) i = "0" + i.toString();
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
  },

  /**
   * 事件函数，显示隐藏答案
   */
  answerAction: function (event) {
    var that = this;
    var isShowAnswer = that.data.isShowAnswer;
    var answerActionStr = '显示';
    isShowAnswer = !isShowAnswer;
    if (isShowAnswer) {
      answerActionStr = '隐藏';
    }
    that.setData({
      isShowAnswer: isShowAnswer,
      answerActionStr:  answerActionStr,
    })
  },

  /**
   * 更新本地存储时间
   */
  updateLearnTime: function() {
    var that = this;
    var titleType = that.data.titleType;
    // 将所做到页数存储到本地
    var titlePage = wx.getStorageSync('titlePage' + titleType) || 1;
    wx.setStorageSync('titlePage' + titleType, ++titlePage);
    // 更新本地学习记录，时间，题目数
    var todayMinutes = wx.getStorageSync('todayMinutes') || 0;
    var todayTitleNum = wx.getStorageSync('todayTitleNum') || 0;
    todayMinutes = todayMinutes + parseInt(that.data.hour) * 60 + parseInt(that.data.minute) + parseInt(that.data.second) / 60;
    todayTitleNum = todayTitleNum + that.data.size;
    wx.setStorageSync('todayMinutes', todayMinutes);
    wx.setStorageSync('todayTitleNum', todayTitleNum);  
  }
})