import http from "utils/request.js"
import request from "utils/request.js"
import regeneratorRuntime from "utils/runtime.js"
import message from './utils/wxRequest.js'
import logisns from "./utils/login.js"
App({
  globalData:{
    info:null
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    let loginStateUUID = wx.getStorageSync('loginStateUUID');
   
    
    if (loginStateUUID) {
  
      let info = wx.getStorageSync('info');
      logisns.getUserInfos(loginStateUUID);
      info = wx.getStorageSync('info');
      if(info){
        this.handleWebSocket()
      }
      
    }
        
  },
  onShow(){

  },
  //双工通信进行建立连接
handleWebSocket() {
  let loginStateUUID = wx.getStorageSync('loginStateUUID');
  if (!loginStateUUID) return;
  let bastUrl = request.wsBaseUrl() 
  console.log(bastUrl);
  let that = this
    let socketOpen = false
    let socketMsgQueue = []
    wx.connectSocket({
      url: bastUrl+'/webSocket/' + loginStateUUID
    })
    wx.onSocketOpen((result) => {
      console.log("连接打开")
    })
    wx.onSocketMessage((result) => {
      console.log(result)

      message.showModalNo(result.data).then(result => {
        if (result) {
          //获取当前打开的页面
          var pages = getCurrentPages()
                
      console.log(pages);
          //获取当前页面的对象
          var currentPage = pages[pages.length-1]
          //获取当前页面的url
          var url = currentPage.route
          console.log(url);
          wx.redirectTo({
            url:"pages/us"
          })
        }
      })
    })
    wx.onSocketOpen(function (res) {
      socketOpen = true
      for (let i = 0; i < socketMsgQueue.length; i++) {
        sendSocketMessage(socketMsgQueue[i])
      }
      socketMsgQueue = []
    })
    function sendSocketMessage(msg) {
      if (socketOpen) {
        wx.sendSocketMessage({
          data: msg
        })
      } else {
        socketMsgQueue.push(msg)
      }
    }

  }

})


