import http from "../../utils/request.js"
import login from "../../utils/login"
import regeneratorRuntime from "../../utils/runtime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    
  },
  bindGetUserInfo(e){
    if(e.detail.errMsg==="getUserInfo:fail auth deny")
      return wx.showToast({title: '授权登陆失败',icon: 'none',});
    let loginStateUUID = login.onLaunch()
    let time = setInterval(() => {
      loginStateUUID = wx.getStorageSync('loginStateUUID');
      if (loginStateUUID) {
        clearInterval(time)
        this.wxGetUserInfo(loginStateUUID)
      }
     }, 100);

  },
  bindOver(){
    wx.reLaunch({
      url: '../index/index',
    })
  },
  //用户授解密信息
  wxGetUserInfo(loginStateUUID){
    // 用户授权
    wx.getUserInfo({
      withCredentials: 'false',
      success: async (result) => {
        const res = await http.get("/saveUserInfo",
        {
        "loginStateUUID":loginStateUUID,
        "encryptedData": result.encryptedData,
        "iv": result.iv
        })
        if(res.code!==200)
          return wx.showToast({title: '授权登陆失败',icon: 'none', duration: 2000 });
        this.getUserInfos(loginStateUUID)
        wx.hideLoading({
          complete: (res) => {},
        })
        wx.navigateBack({
          delta: 1,
        })
        // wx.({
        //   url: '../user/index',
        // })
        wx.showToast({title: '授权成功', icon: 'success', duration: 2000 })
      }
    })
  },
  //存取用户信息
  async getUserInfos(loginStateUUID){
      const res =await http.get("userInfo")
    
      if(res.code===401) return this.getUserInfos(loginStateUUID);
      wx.setStorageSync('info', res.data)
      login.handleWebSocket()
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