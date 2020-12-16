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
    email:'',
    text:'',
    textSize:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  checkEmail(e){
    let email = e.detail.value;
    // 校验邮箱
    this.getEmail(email)
    
  },
  getEmail(email){
    var reg = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$');
    var emailVar = reg.test(email);     // 得到的值为布尔型
    console.log(emailVar);
    if (!emailVar) {
      message.showToastNo("请输入正确的邮箱");
      this.setData({
        email: ''
      })
      return false;
    } 
    
  },
  // 计算输入内容数量
  cleckText(e){
    let text = e.detail.value;
    this.setData({
      textSize: text.length
    })
    
  },
  //
  async headFeedback(e){
    //校验信息
    const ress = await checkInfos()
    if (!ress) return;

    const { textSize} = this.data
    let email = e.detail.value.email
    let text = e.detail.value.email.text
    
    let check= this.getEmail(email)
    
    
    if (!(check === undefined ? true : false)) return message.showToastNo("请输入正确的邮箱");
    if (textSize < 10)  return message.showToastNo("内容不能少于10个字体!")
    let les = await message.showModal("你确定提交反馈吗！")
    if(!les){
      return;
    }
    const res = await http.post("userFeedback", e.detail.value)
    console.log(res);
    
    if (res.code !== 200) return message.showToastNo("反馈失败！")
    message.showToast("反馈成功")
    this.setData({
      email: '',
      text:''
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