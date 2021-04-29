import message from '../../../utils/wxRequest.js'
import http from '../../../utils/request.js'
Page({ 
  data: { 
    //获取输入账号 
    phone: '', 
    // 获取输入密码 
    password:''
  }, 
   
 // 获取输入账号 
  phoneInput(e) { 
  this.setData({ 
  phone:e.detail.value 
  }) 
  }, 
   
 // 获取输入密码 
  passwordInput(e) { 
  this.setData({ 
  password:e.detail.value 
  }) 
  }, 
  onShow(options){
    
  },
 // 登录 
  login(){ 
    let {phone,password} = this.data
    if(phone.length == 0 || password.length == 0){ 
      message.showModal("请输入用户账号、密码");
      return;
    }
      let admin = {}
      admin.username =  phone
      admin.password =  password
      http.post("admin/login",admin).then(item=>{
        if(item.code!=200){
          message.showToastNo(item.msg)
          return;
        }
        // 这里修改成跳转的页面 
        wx.setStorageSync('admin', item.data)
        message.showToastLazd("登录成功")
        setTimeout(function() {
          wx.redirectTo({
            url: '../administrator/index',
          })
        }, 2000) //延迟时间
      })
  }
  
 })