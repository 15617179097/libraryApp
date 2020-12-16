import http from "./request.js"
import request from "./request.js"
import regeneratorRuntime from "./runtime.js"
import message from './wxRequest.js'

// function login(){
//    return wx.checkSession({
//       success: (result) => {
//        let loginStateUUID= wx.getStorageSync("loginStateUUID", result.data);
//         if(loginStateUUID===null||loginStateUUID==="")
//           getCheckLogin();
//         else
//           getUserInfos();
//       },
//       fail: () => {
//         getCheckLogin();
//       },
//       complete: () => {
//         wx.getSetting({
//           success(res) {
//             if (!res.authSetting['scope.userInfo']) {
//               wx.redirectTo({
//                 url: '/pages/authorize/index'
//               })
//             }
//           }
//         })
//       }
//     })
//   }


// //登陆 获取登录态
// function getCheckLogin(){
//   const that = this
//   wx.login({
//     success (res) {
//       if (res.code) {
//         http.get("checkLogin",{"code":res.code})
//         .then(res=>{
//           wx.setStorageSync("loginStateUUID", res.data);
//           if (res.code!==200) {
//             getCheckLogin();
//           }
//           getUserInfos(res.data);
//         })

//       }
//     }
//   })
// }

// //存取用户信息
// async function getUserInfos(loginStateUUID){
//   const res =await http.get("userInfo")
//   console.log(res);
  
//   if(res.code===401) return this.getCheckLogin();
//   wx.setStorageSync('info', res.data)
//   handleWebSocket()
// }

// //双工通信进行建立连接
// function handleWebSocket() {
// let bastUrl = request.baseUrl
// let that = this
//   let loginStateUUID = wx.getStorageSync('loginStateUUID');
//   let socketOpen = false
//   let socketMsgQueue = []
//   wx.connectSocket({
//     url: 'ws://'+bastUrl+'webSocket/' + loginStateUUID
//   })
//   wx.onSocketOpen((result) => {
//     console.log("连接打开")
//   })
//   wx.onSocketMessage((result) => {
//     console.log(result)
//     message.showModalNo(result.data).then(result => {
//       if (result) {
//         that.setData({
//           subscribe: null
//         })
//       }
//     })
//   })
//   wx.onSocketOpen(function (res) {
//     socketOpen = true
//     for (let i = 0; i < socketMsgQueue.length; i++) {
//       sendSocketMessage(socketMsgQueue[i])
//     }
//     socketMsgQueue = []
//   })
//   function sendSocketMessage(msg) {
//     if (socketOpen) {
//       wx.sendSocketMessage({
//         data: msg
//       })
//     } else {
//       socketMsgQueue.push(msg)
//     }
//   }
// }

export default {
  onLaunch() {
    let loginStateUUID=null;
      wx.checkSession({
        success: (result) => {
         loginStateUUID= wx.getStorageSync("loginStateUUID", result.data);
          if(loginStateUUID===null||loginStateUUID==="")
            this.getCheckLogin();

        },
        fail: () => {
          this.getCheckLogin();
        },
        complete: () => {
          wx.getSetting({
            success(res) {
              if (!res.authSetting['scope.userInfo']) {
                // wx.redirectTo({
                //   url: '/pages/authorize/index'
                // })
              }
            }
          })
        }
       
      });
      return loginStateUUID;
  },
  //登陆 获取登录态
  getCheckLogin(){
    const that = this
    wx.login({
      success (res) {
        if (res.code) {
          http.get("checkLogin",{"code":res.code})
          .then(res=>{
            wx.setStorageSync("loginStateUUID", res.data);
            if (res.code!==200) {
              getCheckLogin();
            }
            //that.getUserInfos(res.data);
          })

        }
      }
    })
  },

  //存取用户信息
  async getUserInfos(loginStateUUID){
    const res =await http.get("userInfo")
  
    if(res.code===401) return this.getCheckLogin();
    wx.setStorageSync('info', res.data)
    this.handleWebSocket()
  },

  //双工通信进行建立连接
handleWebSocket() {
  let loginStateUUID = wx.getStorageSync('loginStateUUID');
  if (!loginStateUUID) return;
  let bastUrl = request.baseUrl
  let that = this
    let socketOpen = false
    let socketMsgQueue = []
    wx.connectSocket({
      url: 'ws://'+bastUrl+'webSocket/' + loginStateUUID
    })
    wx.onSocketOpen((result) => {
      console.log("连接打开")
    })
    wx.onSocketMessage((result) => {
      console.log(result)
      message.showModalNo(result.data).then(result => {
        if (result) {
          that.setData({
            subscribe: null
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
}
