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
    userInfo:{},
    subscribe:null,
    subscribeTitle:"",
    createTime:'',
    endTime:'',
    intervalNum:0,
    advertising:null,
    //签到时间范围
    signTime:60*30*1000

  },
  //广告
  toAdvertising(e){
    const {advertising} = this.data
    let advertisingTo=null;
    advertising.forEach(v => {
      if (v.id==e.currentTarget.dataset.id) {
        advertisingTo=v
      }
    });

     wx.reLaunch({
       url: '../advertising/index?fileUrl='+advertisingTo.fileUrl+"&content="+advertisingTo.content+"&title="+advertisingTo.title
     })
  },

  //绑定学号
  handelmyInfo(){
    wx.navigateTo({
      url: '../user/myInfo/index'
    });
      
  },

  //监督占座位
  async headleFeedback(){
    const res = await checkInfos();
    if(!res) {
      this.handelmyInfo()
      return;
    } 
    wx.navigateTo({
      url: '../supervision/index',
    });
      
  },
  //规则
  async handleNotice(){
    const res = await checkInfos();
    if(!res) {
      this.handelmyInfo()
      return;
    }
    wx.navigateTo({
      url: '../notice/index',
    });
  },
  
  //扫码签到
  async handleSm(){
    const res = await checkInfos();
    if(!res) {
      this.handelmyInfo()
      return;
    }
  
    let {subscribe,signTime}=this.data;
    let that=this;
    wx.scanCode({
      scanType:"qrCode",
      onlyFromCamera: true,
      async success (res) {
  
        if(subscribe===null){
          return message.showToastNo('请查看你的预约');
        }
        let date=new Date();
        //当天时间的时间戳
        let nowTime= date.getTime()
        //当天日期的时间戳
        let nowDate=Date.parse(date.toLocaleDateString());
        //预约签到时间最大范围
        // let creSignInTime = subscribe.signInTime-60*subscribe.rangeTime*1000;
        // let signInTime= subscribe.signInTime+60*subscribe.rangeTime*1000;
        let creSignInTime = subscribe.signInTime-signTime;
        let signInTime= subscribe.signInTime+signTime;

        //判断是否超过签到范围
        if(creSignInTime<nowTime&&nowTime<signInTime&&signInTime<(nowDate+24*60*60*1000)){
          let {schoolNum} = wx.getStorageSync("info")
          let code=schoolNum+''+subscribe.classroomId+''+subscribe.seatsId;
          
          if(res.result===code){  
            const res= await http.post("signIn/" + subscribe.id)
            //判断是否请求成功
            if (res.code != 200) return message.showModalNo("签到失败！")
            
            //判断预约状态 
            subscribe['state']=1;
            that.setData({
              subscribe,subscribeTitle:"学习中"
            })
           return message.showToast('签到成功') 
          }else{
            return message.showToastNo('请查看你的预约');
          }
        }else{
          message.showToastNo('请在预约前后30分钟内签到！') 

          // 记录违约


          
        } 
      }
    })
  },

  /**
   * 生 命周期函数--监听页面加载
   */
  async  onLoad(options) {
    //校验信息
    let res =  await http.get("advertising")
    this.setData({
      advertising:res.data
    })
    
    
  },

  //明日预约
  async headelTomorrowSubscribe(){
    //校验信息
    const res = await checkInfos()
    if(!res)  return;

    wx.switchTab({
      url: '../subscribe/index'
    });
      
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    //校验信息
    const res = await checkInfos()
    if(!res)  return;
    
    //websockt
    // this.handleWebSocket();
    
    // //获取我的预约
    this.getMySubscribe();
 
  },
   /*
    查询我的预约
  */
   async getMySubscribe(){
     //校验信息
     const re = await checkInfos()
     if(!re)  return;

     let loginStateUUID= wx.getStorageSync('loginStateUUID');
     const res = await http.get("subscribe/my",{"loginStateUUID":loginStateUUID})
     if(res.code!==200 || res.data==null) return;
     this.setData({
       subscribe:res.data
      })
   },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.intervalNum)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.intervalNum)
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