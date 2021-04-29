import http from '../../../utils/request.js'
import message from '../../../utils/wxRequest.js'
import regeneratorRuntime from "../../../utils/runtime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    supervisionList:null,
    tabs:[
      {
        id:0,
        value:"待处理",
        isActive:true
      },
      {
        id:1,
        value:"已处理",
        isActive:false
      }
    ],
    activeState:0,
    //用户的违约记录
    supervisionList:null
  },
  queryParams: {
    pagenum: 1,
    pagesize: 10
  },
  pageTotal: 1,

  queryParamsAll: {
    pagenum: 1,
    pagesize: 10
  },
  pageTotalAll: 1,

  // 选择
  handleTabs(e){
    let {index}=e.detail
    let {tabs} = this.data
    tabs.forEach(v => v.id===index?v.isActive=true:v.isActive=false)
    this.getSupervisionList(index);
    this.setData({
      tabs, activeState: index
    })
    
  }
  ,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSupervisionList(0);
  },
  //获取所有记录
  async getSupervisionList(state){
    let {schoolId} = wx.getStorageSync('admin')||false
    if(!schoolId){
      wx.redirectTo({
        url: '../index',
      })
    }
    let result= await http.get("get/supervision/list", {"state":state,"schoolId":schoolId})
    if(result.code!==200) return;
    this.setData({
      supervisionList:result.data
    })
    // let allInfo = result.data.allSubscribe;
    // // this.pageTotalAll = result.data.pageTotal
    // this.setData({
    //   allInfo
    // })
  },
  //去处理
  async toUpdateSupervision(e){
    let id = e.currentTarget.dataset.id
    const resMsg = await message.showModal("确定完成该工作吗?")
    if(resMsg){
      const res = await http.post("update/supervision", {"id":id})
      if (res.code !== 200) {
        message.showToastNo("处理失败！")
        return;
      }
      message.showToast("处理成功！")
      setTimeout(()=>{
        this.getSupervisionList(0)
      },2000);
    }
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.this.getSupervisionList(0)
    this.getUserRecord()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // const {activeState} = this.data
    // if (activeState===1){
    //   if (this.queryParams.pagenum >= this.pageTotal) {
    //    return  wx.showToast({ title: '没有下一页了' });
    //   }
    //   this.queryParams.pagenum++
    //   this.getUserRecord()

    // }else{
    //   if (this.queryParamsAll.pagenum >= this.pageTotalAll) {
    //     return wx.showToast({ title: '没有下一页了' });
    //   }
    //   this.queryParamsAll.pagenum++
    //   this.getMyhistoricalAppointment()
      
    // }
    
  }
})