// practiceResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: 0,
    textTips: {},
    titleType: 0,
  },

  /**
   * 声明周期函数，onLoad
   */
  onLoad: function (options) {
    var that = this;
    var result = options.result || 0;
    var textTips = {}
    var titleType = 0;
    if (result == 0) {
      textTips.status = '提交成功';
      textTips.tip = '您已成功提交错误试题，可以继续练习错误试题';
      textTips.primary = '继续练习';
      textTips.secondary = '已完成';
    }else if (result == 1) {
      textTips.status = '提交成功';
      textTips.tip = '您已成功提交该组试题，可查看错题进行练习';
      textTips.primary = '继续下一组';
      textTips.secondary = '已完成';
      titleType = options.titleType;
    }
    that.setData({
      result: result,
      textTips: textTips,
      titleType: titleType,
    })

  },

  /**
   * 下一组
   */
  doNextTitleList: function (event) {
    var that = this;
    var result = that.data.result;
    if (result == 0) {
      var titleType = that.data.titleType;
      wx.redirectTo({
        url: '../exercisePage/exercisePage?titleType=' + titleType,
        success: function(res) {
          console.log('success' + res)
        },
        fail: function(res) {
          console.log('fail' + res)
        },
        complete: function(res) {
          console.log(res)
        },
      })
    }else if (result == 1) {
      wx.redirectTo({
        url: '../specialExercises/specialExercises',
      })
    }
  },

  /**
   * 
   */
  doFinish: function (event) {
    wx.navigateBack({
      delta: 1,
    })
  }
})