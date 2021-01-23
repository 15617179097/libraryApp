import http from '../../utils/request.js'
// es7 简化promise
import regeneratorRuntime from "../../utils/runtime.js"
//检验
import {checkInfos} from "../../utils/check.js"
import message from '../../utils/wxRequest.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //公告数组
    notice:null,
    time:2020
  },
  queryParams: {
    pagenum: 1,
    pagesize: 10
  },
  pageTotal:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.findNotice()
  },

  async findNotice(){
    let {schoolId} = wx.getStorageSync('info')
    const res = await http.get("notice/"+schoolId,this.queryParams)
    if(res.code!=200) return;

    let notice = res.data.notice
    notice.forEach(v => {
    v.content = v.content.split("<img").join('<img style="max-width:100%;height:auto"')
    });
    
    
    this.pageTotal = res.data.total
    this.setData({
      notice
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
    this.setData({
      notice: []
    })
    this.queryParams.pagenum = 1;
    this.findNotice()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.queryParams.pagenum >= this.pageTotal) {
      wx.showToast({ title: '没有下一页了' });

    } else {
      this.queryParams.pagenum++
      this.findNotice()
    }

  },
  text1() {
    // const res = await checkInfos();
    // if(!res)  return;
    wx.navigateTo({
      url: "../noticetext/text1/index"
    })
  },
  text2() {
    // const res = await checkInfos();
    // if(!res)  return;
    wx.navigateTo({
      url: "../noticetext/text2/index"
    })
  },
  text3() {
    // const res = await checkInfos();
    // if(!res)  return;
    wx.navigateTo({
      url: "../noticetext/text3/index"
    })
  },
  text4() {
    // const res = await checkInfos();
    // if(!res)  return;
    wx.navigateTo({
      url: "../noticetext/text4/index"
    })
  }
})