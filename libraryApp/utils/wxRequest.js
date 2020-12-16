const getShowModal=(content)=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '温馨提示',
            content: content,
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
              if (result.confirm) {
                  resolve(result.confirm);
              }
              
            },
            fail: (err) => {
                reject(err);
            },
          });
    })

}
//无取消
const getShowModalNo=(content)=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '温馨提示',
            content: content,
            showCancel: false,
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
              if (result.confirm) {
                  resolve(result.confirm);
              }
            },
            fail: (err) => {
                reject(err);
            },
          });
    })

}
const getShowToast=(title)=>{
    wx.showToast({
        title: title,
        icon: 'success',
        duration: 3000
      });
}

const getShowToastNo=(title)=>{
    wx.showToast({
        title:title,
        icon:'none',
        duration: 3000
    })
}
//封装消息
const message = {
    showModal(title) {
        return getShowModal(title)
    },
    showModalNo(title) {
        return getShowModalNo(title)
    },
    showToast(title) {
        return getShowToast(title)
    },
    showToastNo(title) {
        return getShowToastNo(title)
    }
}

export default message
