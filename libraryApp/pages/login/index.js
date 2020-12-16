import {request,requestPost} from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'',
    password:'',
    numberId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  createCode() {
    var code;
    //首先默认code为空字符串
    code = '';
    //设置长度，这里看需求，我这里设置了4
    var codeLength = 4;
    //设置随机字符
    var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
    
    for(var i=0;i<codeLength;i++){
       //设置随机数范围,这设置为0 ~ 36
       var index = Math.floor(Math.random() * 36);
       code+=random[index];
    }
       //将拼接好的字符串赋值给展示的code
       this.setData({
        code: code
    })
  },
  headLogin(e){
    let {studentId,password} = e.detail.value;
    requestPost('/login',{"studentId":studentId,"password":password}).
    then(result=>{
    console.log(result)
      if(result.data.code===200){

        var loginStateUUID=result.data.data;
        wx.setStorageSync("loginStateUUID", loginStateUUID);
        wx.showToast({
          title: '登陆成功',
          icon: 'success',
          image: '',
          duration: 1500,
          mask: false,
        });
          
        wx.switchTab({
          url: '../index/index'
        });
        
        return ;
       }
       wx.showToast({
        title: '账号密码错误请重新输入',
        icon: 'none',
      });
      this.data({
        password:'', numberId:""
      });
       
    })
   
  },
 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.createCode();
  },


})