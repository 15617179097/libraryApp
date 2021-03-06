import http from '../../utils/request.js'
import regeneratorRuntime from "../../utils/runtime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allInfo:[],
    tabs:[
      {
        id:0,
        value:"全部记录",
        isActive:true
      },
      {
        id:1,
        value:"违约记录",
        isActive:false
      }
    ],
    activeState:0,
    //用户的违约记录
    userRecord:[]
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
    this.setData({
      tabs, activeState: index
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyhistoricalAppointment();
    this.getUserRecord();
  },
  //获取所有记录
  async getMyhistoricalAppointment(){
    let {allInfo} = this.data
    let result= await http.get("findMyAllSubscribe",  this.queryParamsAll)
    
    if(result.code!==200) return;
    let resAllInfo = result.data.allSubscribe;
    //时间格式
    resAllInfo.forEach((v,i) => {
      let index=v.createTime.lastIndexOf(":");
      v.createTime=v.createTime.substring(0,index);
    })
    this.pageTotalAll = result.data.pageTotal
    this.setData({
      allInfo:[...allInfo,...resAllInfo]
    })
  },
  //获取违约记录
  getUserRecord(){
    let {userRecord}= this.data
   http.get("userRecord", this.queryParams).then(res=>{
    if (res.code !== 200) return;
    this.pageTotal = res.data.total
    //时间格式
    res.data.userRecordList.forEach((v, i) => {

      let index=v.createTime.lastIndexOf(":");
      v.createTime=v.createTime.substring(0,index);
    });

    this.setData({
      userRecord: [...userRecord,...res.data.userRecordList]
    })
   })
    
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.queryParams.pagenum=1
    this.queryParamsAll.pagenum=1
    this.getMyhistoricalAppointment()
    this.getUserRecord()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const {activeState} = this.data
    if (activeState===1){
      if (this.queryParams.pagenum >= this.pageTotal) {
       return  wx.showToast({ title: '没有下一页了' });
      }
      this.queryParams.pagenum++
      this.getUserRecord()

    }else{
      if (this.queryParamsAll.pagenum >= this.pageTotalAll) {
        return wx.showToast({ title: '没有下一页了' });
      }
      this.queryParamsAll.pagenum++
      this.getMyhistoricalAppointment()
      
    }
    
  }
})