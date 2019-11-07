
var app = getApp();//获得APP内部的信息
Page({
  ces: function () {
    this.ctx = wx.createCameraContext()
  },
  onLoad() {
    
  },
  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },
  startRecord() {
    this.ctx.startRecord({
      success: (res) => {
        console.log('startRecord')
      }
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        this.setData({
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  data:{
    title: 'hello miniPrograme!!!',
    userInfo:{},
    canIUse:wx.canIUse("button.open-type.getUserInfo"),
    hasUserinfo:false
  },
  change() {
    // 获取数据
    console.log(this.data.title)
    this.setData({
      title:"hello world"
    })
  },
  // 通过点击button，让用户授权获取用户信息
  getUserInfo:function(e){
    // 事件对象e
    console.log(e.detail.userInfo);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserinfo:true
    })
    wx.getUserInfo({
      withCredentials: true,
      success: (res) => {
        console.log(res);
        // console.log(this.globalData);
      }
    })
  },
  goToNews:function(e){
    // console.log(e);
    // console.log(e.currentTarget.dataset.userId);
    wx.switchTab({
      url: '/pages/news/news'
    })
  },
  onLoad:function(options){
    /*页面的第一次初始化，此时可以获得到data中的数据* 
    通过跳转页面所携带的query参数可以通过options获得
    */
        // console.log(this.data.title);
        // console.log("page_onLoad");
    // 判断load的时候，在APP中是否已通过异步获取到用户信息
    if(app.globalData.userInfo){
      console.log(app.globalData.userInfo, 'app.globalData.userInfo')
      // getUserInfo已成功执行
      this.setData({
        userInfo:app.globalData.userInfo,
        hasUserinfo:true
      })
    } else if (this.data.canIUse){
      console.log(this.data.canIUse, 'this.data.canIUse')
      app.getUserinfoCallback = (res) => {
        console.log(res, 'res')
        this.setData({
          userInfo:res.userInfo,
          hasUserinfo: true
        })
      }
    }else{
      console.log(333)
      wx.getUserInfo({
        withCredentials: true,
        success: (res) => {
          this.setData({
            userInfo:res.userInfo,
            hasUserinfo: true
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }





  },
  onReady:function(){
    /*
      此时页面第一次已经渲染完成
    * */
    console.log("page_onReady");
    
  },
  onShow:function(){
    /*页面的显示* */
    console.log("page-show");
  },
  onHide:function(){
    // 通过navigate类型跳转时，仅仅将该页面进行，但是未清除，可以通过navigateBack进行撤回，多用于父子页面之间
    console.log("page-hide");
  },
  onUnload:function(){
    /*
    * 卸载该页面，任何在跳转页面时导致该页面被清空都会进入此处
    */
    console.log("page-unload");
  }
})