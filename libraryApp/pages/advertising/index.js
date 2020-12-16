import regeneratorRuntime from "../../utils/runtime.js"
import http from "../../utils/request"
//检验
import { checkInfos } from "../../utils/check.js"
import message from '../../utils/wxRequest.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    miao:6,
    time:null,
    fileUrl:"../../image/advertising.png",
    content:"广告详情",
    title:"广告标题",
    active:true
  },


  /**
   * 生命周期函数--监听页面显示
   */
  async onLoad(options) {
     this.setData({
      title: options.title,
      fileUrl: options.fileUrl,
      content: options.content
     })
   
   
    let that = this
    var time = setInterval(function () {

      that.setData({
        miao: that.data.miao - 1,
        time
      })
      if (that.data.miao == 0) {
        clearInterval(time)
        that.setData({
          active:false
        })
      }
    },1000)
  },

  cliadv(){
    let {time} = this.data
    clearInterval(time)
    wx.switchTab({
      url: '../index/index',
    })
  }
})