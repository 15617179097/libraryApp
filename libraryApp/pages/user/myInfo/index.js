import http from "../../../utils/request.js"
import message from "../../../utils/wxRequest.js"
// es7 简化promise
import regeneratorRuntime from "../../../utils/runtime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:null,
    studentId:null,
    stuId:null,
    schoolCity: [],
    schoolName: [],
    index:null,
    nameindex:null,
    allCity:{},
    multiIndex: [0, 0],
    multiArray: [],     
    objectMultiArray: []
  },
  //选择省市
  async bindPickerChange(e) {
    let list=[];
    this.data.allCity.forEach(v => {
      if (v.province===this.data.schoolCity[e.detail.value]) {
        list.push(v.schoolName)
      }
    })
    this.setData({
      index: e.detail.value,
      schoolName:list
    })
  },
  //选择学校
  bindPickerChangeName: function(e) {
    let {index} = this.data;
    if (index==null){
      return message.showToastNo("请选择省份");
    }
    this.setData({
      nameindex: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getSchoolCity();
    const info = wx.getStorageSync('info')
    if(info===null) return;
    this.setData({
      info, studentId: info.studentId
    })
   
  },
  async getSchoolCity(){
    const res = await http.get("school/schoolInfo")
    if(res.code!=200) return ;
    this.setData({
    schoolCity:res.data.province,
    allCity:res.data.city
    })
  },
  async getSchoolName(){
    let {index,schoolCity} = this.data;
    let schoolName=null;
    if (index!=null)
      schoolName = schoolCity[index]
    const res = await http.get("school/name/"+schoolName)
  
    this.setData({
      schoolName:res.data
    })
  },
  //校验学号
  bindInstu(e){
  },
  //绑定学号
  async subInfo(e){
    let {studentId,schoolCity,schoolName}=e.detail.value;
    console.log(e.detail.value);
    if(schoolCity===""||typeof(schoolCity) == "undefined"){
      message.showToastNo('省份不能为空')
      return;
    }
    if(schoolName===""||typeof(schoolCity) == "undefined"){
      message.showToastNo('学校不能为空')
      return;
    }
    if(studentId===""){
      message.showToastNo('内容不能为空')
      return;
    }
    if (isNaN(studentId)||studentId.indexOf(" ")>0) {
      message.showToastNo("请输入正确的学号/工号");
      this.setData({
        studentId:null
      })
      return ;
    }

    const res = await http.post("userInfo",{"studentId":studentId,"schoolCity":schoolCity,"schoolName":schoolName,"loginStateUUID":wx.getStorageSync("loginStateUUID")})
    if(res.code===200){
      wx.setStorageSync('info', res.data)
      this.setData({
        info:res.data,
        studentId:res.data.studentId
      })
      this.onShow()
      return message.showToast("绑定成功");;
    }
    message.showModalNo(res.msg)
    this.setData({
      studentId: null
    })
  },

  //返回页面
  blockToPage(){
    wx.navigateBack({
      delta: 1,
    })
  },

  // 解绑学号
 async clearInfo(){
   const data = await message.showModal("你确定解绑当前学号吗?")
    if(data) {
      const res= await http.delete("userInfo")
      if (res.code !== 200) return message.showModalNo("解绑失败！");
      wx.removeStorage({key: 'info'})
      this.onShow()
      message.showToast("解绑成功！")
      this.setData({
        info: null, studentId: null,index:null,schoolName:[]
      })
    }
  },
  bindMultiPickerChange: function(e) {
    this.setData({
      "multiIndex[0]": e.detail.value[0], "multiIndex[1]": e.detail.value[1]
    })
  },   
  onShareAppMessage: function () {
  }
})