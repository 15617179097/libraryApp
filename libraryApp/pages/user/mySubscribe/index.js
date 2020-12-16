import http from '../../../utils/request.js'
// es7 简化promise
import regeneratorRuntime from "../../../utils/runtime.js"
//检验
import { checkInfos } from "../../../utils/check.js"
import message from '../../../utils/wxRequest.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    subscribe: null,
    subscribeTitle: "",
    createTime: '',
    endTime: '',
    intervalNum: 0,
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    wx.hideHomeButton({
      complete: (res) => {},
    })
    //校验信息
    const res = await checkInfos()
    if (!res) return;

    //websockt
    // this.handleWebSocket();

    //获取我的预约
    this.getMySubscribe();

  },
  /*
      查询我的预约
    */
  async getMySubscribe() {
    //校验信息
    const re = await checkInfos()
    if (!re) return;

    let loginStateUUID = wx.getStorageSync('loginStateUUID');
    const res = await http.get("subscribe/my")

    if (res.code !== 200 || res.data == null) return;

    //获取预约时间
    var date = new Date(res.data.signInTime);
    var endDate = new Date(res.data.endTime);

    //预约签到时间格式化 获取时间 去除多余的：0
    var createTime = date.toLocaleTimeString()
    var index = createTime.lastIndexOf(":")
    createTime = createTime.substring(0, index);
    //预约结束时间格式化 获取时间 去除秒
    var endTime = endDate.toLocaleTimeString()
    var endIndex = endTime.lastIndexOf(":")
    endTime = endTime.substring(0, endIndex);
    //获取日期时间戳
    let subscribeDateNum = Date.parse(date.toLocaleDateString())
    //判断预约时间是今天还是明天
    var subscribeTitle = "";
    if (Date.parse(new Date().toLocaleDateString()) < subscribeDateNum)
      subscribeTitle = "明日预约信息"
    else if (res.data.state === 1)
      subscribeTitle = "学习中"
    else
      subscribeTitle = "今天预约信息"
    this.setData({
      subscribe: res.data, subscribeTitle, createTime, endTime
    })

  },
  //暂离
  async handleSuspend() {
    let { subscribe } = this.data;
    let time = 30;
    //查看预约时间
    let cTime = subscribe.endTime - subscribe.signInTime
    if (cTime < (3 * 60 * 60 * 1000)) {
      time = 20;
    }
    const res = await message.showModal('你的最大暂离时间为' + time + '分钟')
    //校验是否暂离
    if (res) this.getSuspend(subscribe.id, time);

  },
  //进行暂离
  async getSuspend(subscribeId, time) {
    const res = await http.post("suspend/add", { "subscribeId": subscribeId, "time": time })
  
    
    if (res.code !== 200) return message.showToastNo("暂离失败!!")
    wx.setStorageSync("suspend", true);

    //进入到暂离页
    wx.reLaunch({
      url: '../suspend/index?time=' + time + '&subscribeId=' + subscribeId
    });
  },
  //前往签到
  toOnLogin(){
    wx.switchTab({
      url: '../../index/index'
    }); 
  },
  //前往预约
  toSubscribe(){
    wx.switchTab({
      url: '../../subscribe/index'
    });  
  },
  
  //取消预约  
  handleRemove(e) {
    let { subscribe } = this.data;
    let { id } = e.currentTarget.dataset;
    let nowTime = new Date().getTime()
    let endTime = subscribe.signInTime - (subscribe.cancelTime * 1000 * 60)
    
    if (subscribe.state === 1) {
      message.showModal('你确定取消座位吗！').then(result => {
        if (result) {
          this.delSeate(id)
        }
      })
      return;
    }
    if (nowTime < endTime) {
      message.showModal('你确定取消当前预约吗！').then( result => {
        if (result) {
          this.delSeate(id)
        }
      })

    } else {
      message.showModal('你确定取消当前预约吗').then( result => {
        if (result) {
          this.delSeate(id)
        }
      })
    }

  },
  async delSeate(id){
     //发起请求
     const res = await http.delete("subscribe/" + id,
     { "loginStateUUID": wx.getStorageSync('loginStateUUID') })

   //校验请求
   if (res.code !== 200) return message.showToastNo("取消失败！")
   message.showToast("取消成功！")
   //清空我的预约以及状态
   this.setData({
     subscribe: null,
     subscribeTitle: ""
   })
  }
})