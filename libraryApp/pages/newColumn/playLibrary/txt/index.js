import http from '../../../../utils/request.js'
// es7 简化promise
import regeneratorRuntime from "../../../../utils/runtime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodes: null,
    dateTime:"2020-01-15"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    console.log(options.id);
   let res= await http.get("notice/"+options.id)
   let dateTime=res.data.time
   let nodes=res.data.content.split("<p").join('<p style="text-indent:2em;"')
   nodes=nodes.split('<p style="text-indent:2em;"><img').join('<p><img style="max-width:100%;height:auto"')
   this.setData({
    nodes,dateTime
   })
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