function getData(url){
  return new Promise(function(resolve,reject){
    console.log(url, 33333333)
    wx.request({
      url: url,
      header:{
        "content-type":"json"
      },
      success:function(res){
        resolve(res);
      },
      fail:function(err){
        reject(err);
      }
    })
    
  })
  
}

module.exports = {
  getData:getData
}