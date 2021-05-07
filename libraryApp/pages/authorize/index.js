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
      success:  (result) => {
         http.get("/saveUserInfo",
        {
        "loginStateUUID":loginStateUUID,
        "encryptedData": result.encryptedData,
        "iv": result.iv
        }).then(
          res =>{
            if(res.code!==200){
              wx.showToast({title: '授权登陆失败',icon: 'none', duration: 2000 });
               return false;
             }
             this.getUserInfos(loginStateUUID)
            //  wx.hideLoading({
            //    complete: (res) => {},
            //  })
            //  wx.navigateBack({
            //    delta: 1,
            //  })
            wx.showToast({title: '授权成功', icon: 'success', duration: 1000 })
            setTimeout(() => {
              http.get("/userInfo",{"loginStateUUID":loginStateUUID}).then(
                (res)=>{
                  if(res.data==null){
                    wx.navigateTo({
                      url: '../user/myInfo/index',
                    })
                  }else{
                    wx.navigateBack({
                         delta: 1,
                       })
                  }
              })
            }, 1000);
            
          }
        )
      }
    })
  },
  //存取用户信息
  async getUserInfos(loginStateUUID){
      const res =await http.get("userInfo")
      if(res.code===401) return false;
      wx.setStorageSync('info', res.data)
    },
})