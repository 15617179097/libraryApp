import http from '../../../utils/request.js'
import regeneratorRuntime from "../../../utils/runtime.js"
import {checkInfos} from "../../../utils/check.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {

    classRoom:null,
    state:null,
    floors:{} ,
    classRoomCp:[],
    activeFloor:0,
    
  },
  // queryParams: {
  //   pagenum: 1,
  //   pagesize: 10
  // },
  pageTotal:1,



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.state==='0') {
      this.getToday() 
    } else {
      this.getTomorrow() 
    }
    this.setData({
      state:options.state
    })
  
    
  },
  //点击教室
  async handelSeats(e){
    //点击教室 判断是否绑定学号 以及信誉值
    const res = await checkInfos()
    if(!res)  return;

    let {id,row,line}=e.currentTarget.dataset;
    let { state } = this.data;
    //跳转到座位页面
         wx.navigateTo({
           url: './seats/index?id=' + id + "&row=" + row + "&line=" + line + "&tabState=" + state,
           })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  async getToday(){
    let {schoolId} = wx.getStorageSync('info')
    //查询所以的教室以及座位
    const res = await http.get("classRoom/today/"+schoolId, this.queryParams)
    if(res.code!==200) return;
    this.setData({
      classRoomCp: res.data.classroomList,classRoom: res.data.classroomList, floors: res.data.floors
    })
    
    
  },
  async getTomorrow(){
    let {schoolId} = wx.getStorageSync('info')
    //查询绑定学号信息
    //查询所以的教室以及座位
    const res = await http.get("classRoom/tomorrow/"+schoolId, this.queryParams)
      if(res.code!==200) return;
    //this.pageTotal = res.data.pageTotal
      this.setData({
        classRoomCp: res.data.classroomList,classRoom: res.data.classroomList, floors: res.data.floors
      })
    
  },
  // 选中楼层
  cleckFloor(e){
    let { classRoomCp} = this.data
    let activeFloor=e.target.dataset.floor
    let activeClassRoom = new Array();
    //楼层0为所有
    if (activeFloor!==0) {
      classRoomCp.forEach(v => {
        if (v.floor === activeFloor) {
          activeClassRoom.push(v)
        }
      });
    } else {
      activeClassRoom = classRoomCp
    }
    
    this.setData({
      classRoom: activeClassRoom, activeFloor
    })
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const {state} =this.data
    this.setData({
      classRoom: [],
      activeFloor: 0
    })
    // this.queryParams.pagenum = 1;
    if (state === "0") {
      this.getToday()
    } else {
      this.getTomorrow()
    }
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const { state } = this.data
      if (state === "0") {
        this.getToday()
      } else {
        this.getTomorrow()
      }
    
    
  }
})