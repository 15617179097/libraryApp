import http from "../../utils/request"
import message from '../../utils/wxRequest.js'
// es7 简化promise
import regeneratorRuntime from "../../utils/runtime.js"
//检验
import { checkInfos } from "../../utils/check.js"
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    creditScore: 0,
    today:null,
    tomorrow:null
  },
  endTime:20,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  //绑定学号
  handelmyInfo(){
    let loginStateUUID = wx.getStorageSync('loginStateUUID');

    if(loginStateUUID!=""){
      wx.redirectTo({
        url: '../user/myInfo/index',
      })
    }else{
      wx.navigateTo({
        url: '../authorize/index'
      });
    }
  },
  checkScore(){
    let {creditScore}=this.data
    if(creditScore<=80){
      message.showModalNo("信誉值不足");
      return false;
    }else{
      return true;
    }
  },

  async todayBut(){
    const res = await checkInfos();
    if(!res) {
      this.handelmyInfo()
      return;
    } 
    const score=this.checkScore()
    if(!score) return;
    let time = new Date().getHours();
    if(time>=this.endTime) return message.showToastNo("预约时间:00:00-20:00")
    wx.navigateTo({
      url: './appointment/index?state=0'
    });
  },

  async tomorrowBut(){
    const res = await checkInfos();
    if(!res) {
      this.handelmyInfo()
      return;
    } 
    const score=this.checkScore()
    if(!score) return;
    wx.navigateTo({
      url: './appointment/index?state=1'
    });
  },
  
  async onShow() {
    const info = wx.getStorageSync("info")
    let {data:res} = await http.get("findMyCreditScore",{"loginStateUUID":wx.getStorageSync('loginStateUUID')})
    let creditScore = info?info.creditScore:0
    let date=new Date()
    let today = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000)
    let tomorrow =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
    this.setData({
      today, tomorrow,creditScore:res.creditScore
    })
  }
})