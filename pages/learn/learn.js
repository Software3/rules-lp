// learn.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrls:[
'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots:true,
    autoplay:true,
    interval:3000,
    duration:500,
    circular:true,
    date:'2017-05-17',
    week:'周三',
    infoObjArray: [
      { id: 0, count: 0, title: '今日刷题/道' },
      { id: 1, count: 0, title: '今日学习/分' },
      { id: 2, count: 0, title: '共打卡/天' },
    ],
    btnTitleArray: [
      { id: 0, title: '专题练习' }, 
      { id: 1, title: '阅读' }, 
      { id: 2, title: '错题练习' },
    ]
  },
  /**
   * 事件处理函数--打卡
   */
  gotoClock: function(event) {
    wx.navigateTo({
      url: '../punchClock/punchClock',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 事件处理函数--专题练习
   */
  gotoLearn0: function(event) {
    wx.navigateTo({
      url: '../../pages/specialExercises/specialExercises',
    })
  },
  /**
   * 事件处理函数--阅读
   */
  gotoLearn1: function(event) {
    wx.navigateTo({
      url: '../../pages/read/read',
    })
  },
  /**
   * 事件处理函数--错题练习
   */
  gotoLearn2: function(event) {
    wx.navigateTo({
      url: '../../pages/exercisePage/exercisePage',
      
    })
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  }
})