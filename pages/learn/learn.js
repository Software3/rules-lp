// learn.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    ],
    textNoticeList: [],
    pictureNoticeList: [],
    imgUrls: [],
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var date = util.getDate(new Date());
    var week = util.getWeek(new Date());
    var that = this;
    that.setData({
      date: date,
      week: week,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var todayMinutes = wx.getStorageSync('todayMinutes') || 0; 
    var todayTitleNum = wx.getStorageSync('todayTitleNum') || 0;
    var that = this;
    var values = [todayTitleNum, todayMinutes, 0];
    var infoObjArray = that.data.infoObjArray;
    for(var i = 0;i < infoObjArray.length;i++) {
      infoObjArray[i].count = Math.round(values[i]);
    }
    that.setData({
      infoObjArray: infoObjArray,
    })
    setTimeout(that.getPictureNotice, 300);
    setTimeout(that.getTextNotice, 500);
  },

  /**
   * 普通函数，请求文本通知
   */
  getTextNotice: function () {
    var that = this;
    wx.request({
      url: 'https://www.ltaoj.cn/rules/notice/getAllTextNotice',
      method: 'get',
      dataType: 'text',
      success: function(res) {
        var textNoticeList = JSON.parse(res.data);
        for (var i = 0; i < textNoticeList.length; i++) {
          textNoticeList[i].submitTime = util.getDate(new Date(textNoticeList[i].submitTime));
        }
        that.setData({
          textNoticeList: textNoticeList,
        });
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 普通函数，请求图片通知
   */
  getPictureNotice: function () {
    var that = this;
    wx.request({
      url: 'https://www.ltaoj.cn/rules/notice/getPictureNotice',
      method: 'get',
      dataType: 'text',
      success: function(res) {
        var pictureNoticeList = JSON.parse(res.data);
        that.setData({
          pictureNoticeList: pictureNoticeList,
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 事件函数，查看通知详细内容
   */
  doNoticeDetail: function (event) {
    var noticeId = parseInt(event.currentTarget.id);
    wx.navigateTo({
      url: '../noticeDetail/noticeDetail?noticeId=' + noticeId,
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