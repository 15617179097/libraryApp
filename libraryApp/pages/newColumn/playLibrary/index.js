// pages/newColumn/playLibrary/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"初级装备",
        isActive:true
      },
      {
        id:1,
        value:"进阶心法",
        isActive:false
      },
      {
        id:2,
        value:"高阶神器",
        isActive:false
      }
      
    ],
    activeState:0
  },
    // 选择
    handleTabs(e){
      let {index}=e.detail
      let {tabs} = this.data
      tabs.forEach(v => v.id===index?v.isActive=true:v.isActive=false)
      this.setData({
        tabs, activeState: index
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