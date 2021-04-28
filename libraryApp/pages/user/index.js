//检验
import {checkInfos} from "../../utils/check.js"
// es7 简化promise
import regeneratorRuntime from "../../utils/runtime.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    uwserInfo:null,
    schoolName:''
  },
  onLogin(){
    wx.navigateTo({
      url: '../login/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loginStateUUID = wx.getStorageSync('loginStateUUID');
    if (!loginStateUUID) {
      //logisns.onLaunch()
      wx.navigateTo({
        url: '../authorize/index',
      })
      return
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let {schoolName} = wx.getStorageSync('info')?wx.getStorageSync('info'):''
 
    wx.getUserInfo({
      success: (result) => {
       this.setData({
         userInfo:result.userInfo,schoolName
       })
      }
    });
  },
  //登陆
  loginGetInfo(){
   wx.navigateTo({
     url: '../authorize/index',
   })
  },
  //绑定学号
  async handelmyInfo(){
    const res = await checkInfos();
    console.log(res);
    if(!res) {
      this.handelmyInfo()
      return;
    }
    wx.navigateTo({
      url: './myInfo/index'
    });    
  },
  // 我的预约
  async mySubscribe(){
    const res = await checkInfos();
    if(!res) {
      this.handelmyInfo()
      return;
    }
    wx.navigateTo({
      url: './mySubscribe/index'  
    })
  },
  //信誉
  async handelmyCredit(){
    const res = await checkInfos();
    if(!res) {
      this.handelmyInfo()
      return;
    }
    wx.navigateTo({
      url: './myCredit/index'
    });
  },
  //我的预约记录
  async handleOldSubscribe(){
    const res = await checkInfos();
    if(!res) {
      this.handelmyInfo()
      return;
    }
    wx.navigateTo({
      url: '../../pages/historicalAppointment/index'
    });
  },
  //反馈建议
  async handleFeedback(){
    // const res = await checkInfos();
    // if(!res)  return;
    wx.navigateTo({
      url: '../../pages/feedback/index'
    });
  },
  //出勤记录
  async attendanceSituation(){
    wx.navigateTo({
      url: '../user/attendanceSituation/index'
    });
  },
  //监督管理
  async handleSupervision(){
    wx.navigateTo({
      url: '../user/supervision/index',
    })
  }
})