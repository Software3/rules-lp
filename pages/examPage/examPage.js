// examPage.js
var util = require('../../utils/util.js')
var test = require('../../utils/test.js')
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
    paper: {},
    startSign: [],
    titlesStr: ['单选题', '填空题', '判断题', '简答题', '案例分析题', '论述题'],
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
        //*********数据*********
        // 拿到paper对象后，需要得到各个题目的总数
        // 并且要初始化某一类型题目的集合以及该集合的第一道题目
        // 题目按照选择题，填空题，判断题，简答题，案例分析题
        // 论述题的顺序进行遍历
        //*********显示*********
        // 每道题目前边要显示题目类型，后边有该题目分数
        // 选择题目下方提供选项进行选择
        // 填空题目下方提供多个单行文本框，大小和该填空题目需要的填空数目一致
        // 其他简答类题目每个题目一个多行文本框
        //*********提交操作*********
        // 选择题、填空题、判断题均是将后台的集合的答案换成用户的答案
        // 简答题、案例分析题、论述题每类答案格式化为一个字符串
        // 最后各种类型的答案组装成一个对象SubmitPaper
        // 在进行后台提交时需要将SubmitPaper和Testrecord
        // 组装成RecordTitles对象
        var paper = res.data;
        var titleList = test.initList(paper)[0];
        var titleType = test.initList(paper)[1];
        var size = test.size(paper);
        if (size == 0 ) return;
        var title = titleList[0];
        var index = 0;
        var answer = new Array(size);
        var startSign = test.startSign(paper);
        that.setData({
          paper: paper,
          titleList: titleList,
          size: size,
          title: title,
          index: index,
          answer: answer,
          titleType: titleType,
          startSign: startSign,
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
    var titleType = that.data.titleType;
    var titleList = that.data.titleList;
    if ((index-that.data.startSign[titleType]) == 0) {
      [titleList, titleType] = test.prevList(that.data.paper, titleType);
      var fillsCount = that.data.fillsCount||[];
      if (titleType == 1) {
        for (var i = 0;i < titleList.length;i++) {
          if (titleList[i].name.match(/#/g) == undefined) {
            fillsCount = that.data.fillsCount;
            break;
          }
          var fillCount = titleList[i].name.match(/#/g).length;
          fillsCount[i] = [];
          for (var j = 1;j <= fillCount;j++) {
            fillsCount[i].push({ blankIdx: j, blankId: (index + 1 + i) + "_" + j, row: (index + 1 + i), col: j });
          }
          titleList[i].name.replace(/#/g, '______');
        }
      }
      that.setData({
        titleList: titleList,
        titleType: titleType,
        fillsCount: fillsCount,
      })
    }
    var title = titleList[--index - that.data.startSign[titleType]];

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
      var isFinish = test.checkAnswer(that.data.answer, that.data.size);
      var content = '';
      // 完成了全部答案
      if (isFinish) {
        content = '你已完成考试内容是否提交？';
      } else {
        content = '你还有题目未做完确定要提交吗';
      }
      // 标识用户是否取消了模态框
      var isCancel = false;
      wx.showModal({
        title: '温馨提示',
        content: content,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '#4285F5',
        success: function (res) {
          // 用户点击了模态框的确认按钮
          if (res.confirm) {
            var data = {};
            // 获取SubmitPaper
            var paper = that.data.paper;
            var startSign = that.data.startSign;
            var size = that.data.size;
            var answer = that.data.answer;
            var submitPaper = that.formatSPaper(paper.titleList, paper.blanksList, paper.judgeList, answer, startSign, size);
            var testRecord = that.data.testRecord;
            data.testrecord = testRecord;
            data.submitPaper = submitPaper;
            wx.showNavigationBarLoading();
            wx.request({
              url: 'https://www.ltaoj.cn/rules/test/submitTest',
              data: JSON.stringify(data),
              header: {
                'content-type': 'application/json',
              },
              method: 'post',
              dataType: 'json',
              success: function (res) {
                var data = res.data;
                wx.hideNavigationBarLoading();
                wx.redirectTo({
                  url: '../../pages/testGrade/testGrade?startTime=' + data.startTime + '&submitTime=' + data.submitTime + '&score=' + data.score,
                })
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
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      var titleType = that.data.titleType;
      var titleList = that.data.titleList;
      var title = {};
      // 判断是否达到切换到下一个集合的条件
      if ((index - that.data.startSign[titleType]) == (titleList.length - 1)){
        [titleList, titleType] = test.nextList(that.data.paper, titleType);
        var fillsCount = that.data.fillsCount||[];
        if (titleType == 1) {
          for (var i = 0; i < titleList.length; i++) {
            if (titleList[i].name.match(/#/g)==undefined){
              fillsCount = that.data.fillsCount;
              break;
            }
            var fillCount = titleList[i].name.match(/#/g).length;
            fillsCount[i] = [];
            for (var j = 1; j <= fillCount; j++) {
              fillsCount[i].push({blankIdx: j,blankId: (index+1+i)+"_"+j, row: (index+1+i), col: j});
            }
            titleList[i].name = titleList[i].name.replace(/#/g, '______');
          }
        }
        that.setData({
          titleList: titleList,
          titleType: titleType,
          fillsCount: fillsCount,
        })
      }
      // 根据不同的条件对题目进行不同的处理 
      title = titleList[++index - (that.data.startSign[titleType])];

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
    var leftTime = [hour, minute, second].map(util.formatNumber).join(':');
    that.setData({
      leftTime: leftTime,
    })
    setTimeout(function () {
      that.startTimer(that.data.leftTime);
    }, 1000);
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
   * 工具函数，组装上传答案的Paper
   */
  formatSPaper: function (titleList,blanksList,judgeList, answer, startSign, totalSize) {
    var that = this;
    // 格式化选择题集
    titleList = test.formatAnswer(titleList, answer);
    // 格式化填空题答案
    var fillsCount = that.data.fillsCount;
    blanksList = test.formatBAnswer(blanksList, answer, startSign[1], fillsCount);
    // 格式化判断题答案
    judgeList = test.formatJAnswer(judgeList, answer, startSign[2]);
    // 格式化问答题答案
    var shortAnswer, caseAnswer, discussAnswer;
    var shortSize = startSign[4]-startSign[3];
    var caseSize = startSign[5]-startSign[4];
    var discussSize = totalSize - startSign[5];
    shortAnswer = test.formatQAnswer(answer, startSign[3], shortSize);
    caseAnswer = test.formatQAnswer(answer, startSign[4], caseSize);
    discussAnswer = test.formatQAnswer(answer, startSign[5], discussSize);

    // 组装SubmitPaper对象
    var submitPaper = {};
    submitPaper.titleList = titleList;
    submitPaper.blanksList = blanksList;
    submitPaper.judgeList = judgeList;
    submitPaper.shortAnswer = shortAnswer;
    submitPaper.caseAnswer = caseAnswer;
    submitPaper.discussAnswer = discussAnswer;
    return submitPaper;
  },

  /**
   * 填空文本框confirm事件
   */
  storeFillAnswer: function (e) {
    var inputId = e.currentTarget.id;
    var that = this;
    var answer = that.data.answer;
    var rowcol = inputId.split('_');
    var row, col;
    [row, col] = [parseInt(rowcol[1]), parseInt(rowcol[2])];
    if(answer[row] == undefined) answer[row] = [];
    answer[row][col] = e.detail.value;
    that.setData({
      answer: answer,
    })
  },

  /**
   * 问答题多行文本框confirm事件
   */
  storeQuestionAnswer: function (e) {
    var inputId = e.currentTarget.id;
    var that = this;
    var answer = that.data.answer;
    var rowcol = inputId.split('_');
    var row;
    row = parseInt(rowcol[1]);
    answer[row] = e.detail.value;
    that.setData({
      answer: answer,
    })
  }
})