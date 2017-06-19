// login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: '登录',
    back: '返回',
    ph_studentId: '请输入学号',
    ph_password: '请输入密码',
    account: '',
    password: '',
    loading: false,
  },

  /**
   * 绑定学号输入框
   */
  keyAccount: function (event) {
    var that = this;
    that.setData({
      account: event.detail.value,
    })
  },

  /**
   * 绑定密码输入框
   */
  keyPassword: function (event) {
    var that = this;
    that.setData({
      password: event.detail.value,
    })
  },
  /**
   * 事件函数，登录
   */
  doLogin: function (event) {
    var that = this;
    if(that.data.account.toString().length == 0 
      || that.data.password.toString().length == 0) {
      return;
    }
    // 设置加载动画
    that.setData({
      loading: true,
    })
    var json = {};
    json.studentId = that.data.account;
    json.password = that.data.password;
    wx.request({
      url: 'https://www.ltaoj.cn/rules/account/login',
      data: JSON.stringify(json),
      header: {
        'content-type': 'application/json;charset:utf-8',
      },
      method: 'post',
      dataType: 'json',
      success: function(res) {
        var userInfo = res.data;
        if (userInfo.code == undefined) {
          wx.showToast({
            title: '登录成功',
          })
          // 将返回的用户信息保存到本地
          wx.setStorageSync('userInfo', userInfo);
          // 重定向到首页
          wx.switchTab({
            url: '../learn/learn',
          })
        } else {
          wx.showToast({
            title: '登录失败',
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '服务器连接失败,请稍后重试',
        })
      },
      complete: function(res) {
        // 结束加载动画
        that.setData({
          loading: false,
        })
      },
    })
  },

  /**
   * 事件函数，回退
   */
  doBack: function (event) {
    wx.navigateBack({
      delta: 1,
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
  
  }
})