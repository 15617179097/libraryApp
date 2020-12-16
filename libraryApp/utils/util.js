const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}
const urls="localhost:8080"
export  function  request(url,value){
  console.log(url)
   return new Promise((resolve,reject)=>{
     var reqTask = wx.request({
       url: urls+url,
       data: value,
       method: 'GET',
       dataType: 'json',
       success: (result) => {
         resolve(result);
       },
       fail: (err) => {
         reject(err);
       },
       complete: () => {}
     });
       
   })
}

