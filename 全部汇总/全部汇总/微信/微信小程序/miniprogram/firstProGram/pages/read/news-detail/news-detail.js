var data=require('../../../data/posts-data.js');
var app=getApp();
// pages/read/news-detail/news-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collected:false,
    isPlaying:false,
    id: ""
  },
  // 监听背景音乐控制器的轻敲事件
  changeMusic(){
    var isPlaying=!this.data.isPlaying;
    if(isPlaying){
      var music=data.newsList[this.data.id].music;
      console.log(music)
      wx.playBackgroundAudio({
        dataUrl: music.url,
        title: music.title,
        coverImgUrl: music.coverImg
      })
    }else{
      wx.pauseBackgroundAudio();
    }
    this.setData({
      isPlaying:isPlaying
    })
    app.globalData.globalIsPlay =isPlaying
  },
  changeCollect(){
    var collect = !this.data.collected
    wx.showModal({
      title: '收藏文章',
      content: collect ? '你是否收藏该文章？' : '你是否取消收藏？',
      showCancel: true,
      cancelText: '否',
      cancelColor: '#aaa',
      confirmText: '是',
      confirmColor: '#405f80',
      success: res=> {
        var a;
        if(res.confirm){
          this.setData({
            collected:collect
          })
          try{
            wx.setStorageSync(this.data.id, collect)
            a = collect ? '收藏成功' : '取消收藏'
          }catch(e){
            a=collect?'收藏失败':'取消收藏失败'
          }
        }
        wx.showToast({
          title: res.confirm?a:'已取消',
          icon: res.confirm ? 'success' : 'none',
          image: '',
          duration: 1500,
          mask: true,
          success: function (res) {
            console.log(res)
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var newsId=this.data.id=options.newsId;
    this.setData({
      news:data.newsList[newsId],
    })
    // 添加对音乐播放状态的监听
    if (newsId == app.globalData.newsId && app.globalData.globalIsPlay){
      this.setData({
        isPlaying: true
      })
    }else{
      this.setData({
        isPlaying: false
      })
    }
    wx.onBackgroundAudioPlay(()=>{
      //音乐播放回调
      this.setData({
        isPlaying:true
      })
      app.globalData.globalIsPlay=true;
      app.globalData.newsId=newsId;
    })
    wx.onBackgroundAudioPause(() => {
      //音乐暂停回调
      this.setData({
        isPlaying: false
      })
      app.globalData.globalIsPlay = false;
      app.globalData.newsId = -1;
    })
    wx.getStorage({
      key: this.data.id,
      success: res=> {
        if(res.data!=undefined){
          this.setData({
            collected:res.data
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})