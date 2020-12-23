import http from ".././../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:0,
    subscribeCount:0,
    attendance:0 
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
  async onShow(){
    let {data:res} = await http.get("findMySubscribeInfo",{"loginStateUUID":wx.getStorageSync('loginStateUUID')})
    this.setData({
      time:res.time,
      subscribeCount:res.subscribeCount,
      attendance: res.signInPercentage
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