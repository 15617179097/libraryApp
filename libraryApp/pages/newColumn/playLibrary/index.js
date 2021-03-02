import http from '../../../utils/request.js'
// es7 简化promise
import regeneratorRuntime from "../../../utils/runtime.js"
// //检验
// import {checkInfos} from "../../utils/check.js"
// import message from '../../utils/wxRequest.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"初来乍到",
        isActive:true
      },
      {
        id:1,
        value:"跃跃欲试",
        isActive:false
      },
      {
        id:2,
        value:"渐入佳境",
        isActive:false
      }
      
    ],
    activeState:0,
    //数组
    notice3:null,
    notice4:null,
    notice5:null,
    time:2020
    },
    queryParams: {
    pagenum: 1,
    pagesize: 10
    },
    pageTotal:1,
    state:3,
    // 选择
    handleTabs(e){
      let {index}=e.detail
      let {tabs} = this.data
      tabs.forEach(v => v.id===index?v.isActive=true:v.isActive=false)
      console.log(index);
      this.setData({
        tabs, activeState: index
      })

       this.findNotice(index)
    },

    onLoad: function (options) {
      let {activeState}=this.data
      this.findNotice(activeState)
    },
  
    async findNotice(state){
      state=state+3
      let {schoolId} = wx.getStorageSync('info')
      const res = await http.get("notice/"+schoolId+"/"+state,this.queryParams)
      if(res.code!=200) return;
  
      let notice = res.data.notice
      console.log(notice);
      // notice.forEach(v => {
      // v.content = v.content.split("<img").join('<img style="max-width:100%;height:auto"')
      // });
      
      
      this.pageTotal = res.data.total
      this.setData({
        notice3:notice
      })
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



  clickText(e) {
    console.log(e);
    console.log(e.currentTarget.dataset.id);
    // const res = await checkInfos();
    // if(!res)  return;
    wx.navigateTo({
      url: "./txt/index?id="+e.currentTarget.dataset.id
    })
  }
})