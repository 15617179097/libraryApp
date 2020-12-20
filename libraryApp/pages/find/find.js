Page({
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: 'page/component/pages/swiper/swiper'
    }
  },

  data: {
    swpierTrue:true
  },

  changeIndicatorDots() {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },

  changeAutoplay() {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },

  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },

  
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },

  aboutLibrary() {
    // const res = await checkInfos();
    // if(!res)  return;
    wx.navigateTo({
      url: "../newColumn/aboutLibrary/index"
    })
  },
  
  curatorMessage(){
    // const res = await checkInfos();
    // if(!res)  return;
    wx.navigateTo({
      url: "../newColumn/curatorMessage/index"
    })
  },
  
  playLibrary(){
    // const res = await checkInfos();
    // if(!res)  return;
    wx.navigateTo({
      url: "../newColumn/playLibrary/index"
    })
  }
})

