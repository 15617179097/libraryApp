// pages/user/myCredit/index.js
Page({

  /**
   * 页面的初始数据
   */
    data: {
      imgUrl:'https://wxapp-library-20.oss-cn-beijing.aliyuncs.com/img/card.jpg?Expires=1608546599&OSSAccessKeyId=TMP.3Ki2nZ8VrwrhcdvdjcpYehQ8jwyhuKYPvrwdjf2VR2kNnBUvtnmJTBty31a48esqGZrgHBkyN1oAC2zsVmdhQVpr52P79d&Signature=aa0J49bfnu0mY62G6GLVEtXR0ow%3D',
    creditScore:60
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
    let {creditScore} = wx.getStorageSync('info')
    this.setData({
      creditScore
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