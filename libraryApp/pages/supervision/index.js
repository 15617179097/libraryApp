import http from '../../utils/request.js'
import message from '../../utils/wxRequest.js'
import regeneratorRuntime from "../../utils/runtime.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //自修室列表
    classRoomList:null,
    //自修室座位列表
    classRoom: [],
    index:0,
    seatsNum:null,
    fedText:""

  }, 
  //文本域的输入事件
  handleTextInput(e){
    this.setData({
      fedText:e.detail.value
    })
  },
  //提交按钮的点击
  handleFormSubmit(){
    //1、获取文本域的内容
    const{fedText}=this.data;
    //2、合法性的验证
    if(!fedText.trim()){
      wx.showToast({
        title: '内容不能为空',
      })
    } 
    
  },
   bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  checkseatsName(e){
    if (isNaN(e.detail.value)) {
      message.showToastNo("请输入正确的座位号");
      return '';
    }
    const { index, classRoomList} = this.data
    if (e.detail.value > classRoomList[index].classroomNumber || e.detail.value<0){
      this.setData({
        seatsNum:null
      })
      message.showToastNo("请输入正确的座位号");
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
<<<<<<< HEAD
    var ta=options.classRoomList;   
    console.log(txt);
=======
>>>>>>> e34a427bec47e60c9bd50add2929ed251a558a48
  },
  async supervisionFrom(e){
    const { classRoomList} = this.data
<<<<<<< HEAD


=======
>>>>>>> e34a427bec47e60c9bd50add2929ed251a558a48
    if (e.detail.value.seatsNum=='') return message.showToastNo("座位号不能不为空")
    if (classRoomList==null) return message.showToastNo("教室不能不为空")
    if (e.detail.value.fedText=='') return message.showToastNo("内容不能为空")
    const result =  await message.showModal("监督占座！ 你确定提交吗！")
    if(!result) return;
    const res = await http.post("supervision",
      {
      "schoolId": wx.getStorageSync('info').schoolId,
      "classroomId": classRoomList[e.detail.value.classRoomName].id,
      "seatsNum": e.detail.value.seatsNum,
      "fedText":e.detail.value.fedText
      })
    if (res.code != 200) return message.showToastNo("监督占座失败！");
    message.showToast("监督占座成功！");
    this.setData({
      seatsNum: null,
      fedText: null
    })
   

  },

  async onShow () {
    let {schoolId} = wx.getStorageSync('info')
    let result = await http.get("classRoom/findClassRoom/"+schoolId)
      let classRoom =[]
      result.data.forEach(v => {
        classRoom.push(v.classroomName)
      });
      
      this.setData({
        classRoom, classRoomList: result.data
      })
  }
})