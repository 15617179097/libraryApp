import http from ".././../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
    data: {
      imgUrl:'http://wxapp-library-20.oss-cn-beijing.aliyuncs.com/img/card.jpg',
      creditScore:60,
      subscribeErrorCount:0,
      subscribeSuccessCount:0,
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
 async onShow () {
    // let {creditScore} = wx.getStorageSync('info')
    
   
   let {data:res} = await http.get("findMyCreditScore",{"loginStateUUID":wx.getStorageSync('loginStateUUID')})
    // console.log(res.creditScore);
    // res.subscribeErrorCount
    // res.subscribeSuccessCount
    this.setData({
      creditScore:res.creditScore,
      subscribeErrorCount:res.subscribeErrorCount,
      subscribeSuccessCount: res.subscribeSuccessCount
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