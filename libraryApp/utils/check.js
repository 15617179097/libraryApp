import message from './wxRequest.js'

  // 校验是否绑定学号 信誉是否为0
  export const  checkLogin = () => {
    const loginStateUUID = wx.getStorageSync('loginStateUUID');
    if (loginStateUUID.length<=0){
      // message.showToast("请先授权登陆");
      return false;
    }

    return true;
   }

   export const  checkInfos = () => {
    const info = wx.getStorageSync('info');
    if (info === null){
      // message.showToast("请先绑定学号");
      return false;
    }

    if(info.studentId==null){
      // message.showToast("请先绑定学号");
      return false;
    }
    
    // if(info.creditScore<=80){
    //   message.showModalNo("信誉值不足");
    //   return false;
    // }else{
    //   return true;
    // }
    return true;
   }