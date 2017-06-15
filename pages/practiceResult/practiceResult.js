// practiceResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  doNextTitleList: function (event) {
    wx.redirectTo({
      url: '../specialExercises/specialExercises',
    })
  },

  doWrongTitle: function (event) {
    wx.redirectTo({
      url: '../exercisePage/exercisePage?method=dowrong',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})