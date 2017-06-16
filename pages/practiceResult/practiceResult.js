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

  doFinish: function (event) {
    wx.navigateBack({
      delta: 1,
    })
  }
})