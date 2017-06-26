// registContest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contestInfo: {},
    contestregistion: {},
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
    wx.request({
      url: 'https://www.ltaoj.cn/rules/test/getContestInfo',
      method: 'get',
      success: function(res) {
        console.log(res.data);
        that.setData({
          contestInfo: res.data,
        })
        var userInfo = wx.getStorageSync('userInfo');
        var json = {};
        json.studentId = userInfo.studentId;
        json.testId = res.data.testId;
        wx.request({
          url: 'https://www.ltaoj.cn/rules/test/isRegisted',
          data: JSON.stringify(json),
          header: {
            'content-type': 'application/json',
          },
          method: 'post',
          dataType: 'json',
          success: function(res) {
            that.setData({
              contestregistion: res.data,
            })
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      fail: function(res) {},
      complete: function(res) {},
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