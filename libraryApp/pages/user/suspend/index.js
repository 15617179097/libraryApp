var util = require('../../../utils/util.js');
import http from "../../../utils/request.js"
import message from "../../../utils/wxRequest.js"
// es7 简化promise
import regeneratorRuntime from "../../../utils/runtime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subscribeId:'',
    time:'',
    HH:'',
    mm:'',
    ss:'',
    strat:false,
    endTime:'',
    timer:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var {time,subscribeId}=options;
    let {HH,mm,ss}=this.data
    
    //记录暂离
    this.getAdd(time)
    var date=new Date();
    let endTimeLong=date.getTime()+(time*60*1000);
    var endTime=util.formatTime(new Date(endTimeLong))
    //console.log(endTime);
    
    if (time>60) {
      HH= Math.ceil(item/60);
      mm=time%60
    }else{
      HH="00"
      mm=time //time
      ss="00"
    }

    /*var HH=date.getHours();
    var mm=date.getMinutes();
    var ss=date.getSeconds();*/
  
    this.setData({
      HH,mm,ss,endTime,time,subscribeId
    })
    this.time(HH,mm,ss);
    
  },
  async getAdd(time){
    const res = await http.post("suspend/add", { "time": time })
    if(res.code!=200){
      wx.redirectTo({
        url: '../mySubscribe/index'
      });
        
      return this.message.getShowToastNo("暂离失败！");
    }
  },
  //定时时间
  time(HH,mm,ss){

    let timer = setInterval(async () => {
      if (ss==0) {
        ss=60;
        mm--;
      }
      ss--;
      if(HH<10){
        HH="0"+parseInt(HH);
      }
      if(mm<10){
        mm="0"+parseInt(mm);
      }
      if(ss<10){
        ss="0"+parseInt(ss);
      }
      if(parseInt(HH)===0&&parseInt(mm)===0&&parseInt(ss)===0){
        let {timer,subscribeId}=this.data;
        //清除定时器
        clearInterval(timer);
        const res = await http.post("signIn/updateSignInById",{"subscribeId":subscribeId})
        if(res.code!==200){
           http.post("signIn/updateSignInById", { "subscribeId": subscribeId })
        }
        let confirm = await message.showModalNo('未按规定时间归位，座位释放、记录违规')
          if (confirm) {
            wx.switchTab({
              url:'../index',
              fail:()=>{
                wx.switchTab({
                  url:'../index'
              })
              }
            });
          }
      }
     this.setData({
      HH,mm,ss
     })
    }, 1000);
    this.setData({
      HH,mm,ss,timer
    })
  },
  //结束暂离
  handleEnd(){
    const { timer} = this.data
    clearInterval(timer)
    wx.switchTab({
      url: '../../user/index'
    });
      
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
 
  onReady: function ( ) {
 
  }

,

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton({
      complete: (res) => {},
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  async onUnload() {
    this.handleEnd()
    message.showToast("结束暂离成功")

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