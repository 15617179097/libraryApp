const wsBaseUrl="wss://www.paw35u.cn/app"
// const wsBaseUrl="ws://localhost:8001/"
 import login from './login.js'

const baseUrl="https://www.paw35u.cn/app/"
// const baseUrl="http://localhost:8001/"

 function request(u, data, method) {
    return new Promise((resolve, reject) => {
        wx.showLoading({ title: '加载中' })
        if(method===null)   method = 'get'
        let headelContentType=null
        if(method==='POST')
            headelContentType = 'application/x-www-form-urlencoded;charset=utf-8'
        else
            headelContentType = 'application/json;charset=utf-8'
        wx.request({
            url: baseUrl + u,
            header: {
                'content-type': headelContentType,
                'token': wx.getStorageSync('loginStateUUID')
            },
            method: method,
            data: data,
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
                // 校验是否token是否过期
                if (result.data.code === 401) {
                    wx.removeStorageSync('loginStateUUID')
                    wx.clearStorageSync()
                    reLogin()
                }
                // 成功返回
                resolve(result.data);
                wx.hideLoading({ complete: (res) => { } })
            },
            //异常
            fail: (err) => {
                reject(err);
            }
        });
    })
}
// 封装请求方法
const http = {
    get(url, data) {
        return request(url,data,'GET')
    },
    post(url, data) {
        return request(url, data, 'POST')
    },
    put(url, data) {
        return request(url, data, 'PUT')
    },
    delete(url, data) {
        return request(url, data, 'DELETE') 
    },
    baseUrl(){
        return baseUrl
    },
    wsBaseUrl(){
        return wsBaseUrl
    }
}
export default http
function reLogin(){
    wx.showModal({
        title: '提示',
        content: '你的登录信息过期了，请重新登录',
        success (res) {
          if (res.confirm) {
            //login.onLaunch()
            wx.navigateTo({
                url: '/pages/authorize/index'
              })
          } else if (res.cancel) {
            wx.navigateTo({
                url: '/pages/index/index'
              })
          }
        }
      }) 
}
//存取用户信息
function  getUserInfos(){
   request("userInfo/"+ wx.getStorageSync("loginStateUUID")).then(result => {
    wx.setStorageSync('info', result.data)
   })

}
