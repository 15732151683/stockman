App({

  globalData:{
    // 整个小程序全局变量
    userInfo:null,
    globalIsPlay:false,
    newsId:-1,
    url:"https://douban.uieee.com/v2/movie/"
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    
    console.log("onLunch");
    // 判断授权状态
    wx.getSetting({
      success: res => {
        console.log(res);
        if(res.authSetting["scope.userInfo"]){
          // 已授权可以用户信息
          wx.getUserInfo({
            withCredentials: true,
            success: (res) => {
              console.log(res);
              // console.log(this.globalData);
              this.globalData.userInfo = res.userInfo;
              if(this.getUserinfoCallback){
                // 为了防止该回调载执行时页面load已经加载过
                this.getUserinfoCallback(res);
              }
            }
          })
        }
      }
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    console.log("onShow");
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    console.log("onHide");
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    console.log("onError");
  }
})
