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
      if(!info){
        logisns.getUserInfos(loginStateUUID)
      }
      
    }
        
  }

})


