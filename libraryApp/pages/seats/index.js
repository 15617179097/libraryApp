import http from "../../utils/request.js";
import message from "../../utils/wxRequest.js";
import regeneratorRuntime from "../../utils/runtime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabState:null,//判断今天还是明天的预约查询 0：今天 1 明天
    classRoomId:0,
    seats:[],
    options:[],   //记录当前用户选的座位的下标值
    row:0,
    line:0,
    optionsRow:0,
    optionsLie:0,
    startTime: null,
    startEndTime: null,
    // 选择的开始与结束时间
    time:'',
    endTime:'',
    // 判断是否已经预约
    subscribeState:false,

  },
  onShow: function () {
    var date = new Date();
    this.setData({
      startTime: date.getHours() + ":" +(date.getMinutes()+30),
      startEndTime: date.getHours() + 1 + ":" + (date.getMinutes() + 30)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

    //教室传值
    let {id,row,line,tabState}=options;
    this.getSeats(id,null,tabState);
    let loginStateUUID= wx.getStorageSync('loginStateUUID');

    //校验是否预约
    const res = await http.get("subscribe/check",{"loginStateUUID":loginStateUUID})
    if(res.code!==200) retuen;
    //获取是否预约
      this.setData({
        subscribeState:res.data,
        row,line,tabState
      })
  },
  /*根据教室id进行查询座位 */
  async getSeats(id,time,tabState){
    const res = await http.get("seats/" + id,{"createTime":time,"timeState":tabState})

    //校验是否请求成功
    if(res.code!=200) return;
      
    let seats=res.data;
    
    //数组图片变
    seats.forEach((v,i) => {
      if(v.state===0&&v.seatsV===undefined)
      seats[i]["img_src"]="../../image/seats_n.png";
      else  seats[i]["img_src"]="../../image/seats_y.png";
    });
    this.setData({
      seats:res.data,classRoomId:id
    })
  }, 
  /*点击座位触发 */
  async handleCheckSeate(e){
    let {index}=e.currentTarget.dataset;
    let {seats,endTime,time,classRoomId,subscribeState,tabState}=this.data;
        //判断是否预约过
        if(subscribeState){
          message.showToast("你已经有预约过了");
          return;
        }
        //判断请先选时间
        if(time===''){
          message.showToast("请你选择就位时间");
          return;
        }
        if(endTime===''){
          message.showToast("请你选择结束时间");
          return;
        }
        //渲染座位
        this.getChooseSeats(index);
        const result = await message.showModal('您确定要预约图书馆座位吗')
        if (result) {
          
        //判断是今天预约还是明天预约
        if (tabState==0){
          //今天预约
          var todayTime=this.getTodayTime(time);
          var todayEndTime=this.getTodayTime(endTime);
          this.getSubscribeInfo(todayTime,todayEndTime,seats[index].id,classRoomId,index,tabState);
        }else{
          //明天预约
          var tomorrowTime=this.getTomorrowTime(time);
          var tomorrowEndTime=this.getTomorrowTime(endTime);
          this.getSubscribeInfo(tomorrowTime,tomorrowEndTime,seats[index].id,classRoomId,index,tabState);
        }
        
      }else{
          delChooseSeats(index)
      }
   
  },
  //用户确定预约获取预约信息以及返回状态
  async getSubscribeInfo(createTime,endTime,seatsId,classRoomId,index,tabState){
    const res = await http.post("subscribe/"+classRoomId+'/'+seatsId,{"loginStateUUID":wx.getStorageSync('loginStateUUID'),"createTime":createTime,"endTime":endTime})
    //是否成功校验
    if(res.code!==200) return  message.showToastNo("预约失败");
      
      /*wx.navigateTo({
        url: '../../pages/msg/index' 
      })*/
      //wx.setStorageSync("subscribeSeats", "到位时间为："+tomorrowTime+"当前选的座位号："+options+1+"号 ，第"+this.data.optionsRow+"行,"+this.data.optionsLine+"列");
    
    //刷新页面
    this.getSeats(classRoomId,null,tabState);
    message.showToast("预约成功");
  },

  //选择状态进行修改数组
  getChooseSeats(index){
     let {seats,options}=this.data;
    // options.push(index);
    seats.findIndex((v,i)=>{
      if(i===index)
      seats[i]["img_src"]="../../image/seats.png";
    })
    //判断用户有没有选中 
   /* if(options.length>0){
      //初始化数组
      seats.findIndex((v,i)=>{
        seats[options]["img_src"]="../../image/seats_n.png";
      })
    }*/
    //seats_n.png未选中 seats.png选中
    //判断opIndex内是否与当前选择的一样
   /*  let opIndex=options.findIndex(v=>v===index);*/
    // --1 代表着不一样
   /* if(opIndex===-1){
      options=[];
      options.push(index);
      seats.findIndex((v,i)=>{
        if(i===index)
        seats[i]["img_src"]="../../image/seats.png";
      })
    }else{
      //如果选中的本身 是选中效果 从数组中删除并改变中seats img_src
      options.forEach((v,i)=>{
        if(v===index){
          options.splice(i,1)
          seats.findIndex((v,i)=>{
            if(i===index)
            seats[i]["img_src"]="../../image/seats_n.png";
          })
        }
      })
    }*/
    this.getSeatsRowAndLine(options)
    this.setData({
      subscribeState:true
    })
  },
  //取消选中座位
  delChooseSeats(index) {
      let {seats,options}=this.data;
    // options.push(index);
    seats.findIndex((v, i) => {
      if (i === index)
        seats[i]["img_src"] = "../../image/seats.png";
    })
    this.setData({
      subscribeState: false
    })
  },
  //根据选中计算 行列
  getSeatsRowAndLine(options){
    let {row}=this.data;
    options=options[0]+1;
    let optionsRow=Math.ceil(options/row);
    let optionsLine=Math.ceil(options%row);
    if(optionsLine===0)
    optionsLine=8;
    this.setData({
      optionsRow,optionsLine
    })
  
  },
  //时间选择
  bindTimeChange: function(e) {
    let {classRoomId,tabState}=this.data
    this.getSeats(classRoomId,e.detail.value,tabState);
    this.setData({
      time: e.detail.value,endTime:''
    })
  },
    //结束时间选择
  bindEndTimeChange: function(e) {
    let time=this.data.time
    if(time===''){
      message.showToastNo('请先选择开始时间');
      return;
    }
    var timeNum=Date.parse(new Date(this.getTomorrowTime(time)))
    var endTime=Date.parse(new Date(this.getTomorrowTime(e.detail.value)))
    if(timeNum>endTime){
      message.showToastNo('请先选择正确的时间范围');
      return;
    }
    if((endTime-timeNum)<(60*60*1000)){
      message.showToastNo('最少预约一小时以上');
      return;
    }
      this.setData({
        endTime: e.detail.value
      })
    },
      //获取今天时间
  getTodayTime(time){
    var tomorrow=new Date();
    var nowDate=tomorrow.toLocaleDateString().split("/").join("-");
    var tomorrowTime=nowDate+" "+time;
    return tomorrowTime;
  },
  //获取明天时间
  getTomorrowTime(time){
    var tomorrow=new Date();
    tomorrow.setTime(tomorrow.getTime() + 24*60*60*1000);
    var nowDate=tomorrow.toLocaleDateString().split("/").join("-");
    var tomorrowTime=nowDate+" "+time;
    return tomorrowTime;
  }


  
})