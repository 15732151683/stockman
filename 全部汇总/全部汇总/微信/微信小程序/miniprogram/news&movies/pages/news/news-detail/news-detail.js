// pages/news/news-detail/news-detail.js
var data = require("../../../data/posts-data.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news:{},
    collected: false,
    isPlaying: false,
    newsId:-1
  },
  /** 监听背景音乐控制器的轻敲事件*/
  changeMusic:function(){
    var isPlaying = !this.data.isPlaying;
    this.setData({
      isPlaying:isPlaying
    })
    app.globalData.globalIsPlay = isPlaying;
    var newsId = this.data.newsId;
    var music = data.newsList[newsId].music;
    console.log(music);
    if(isPlaying){
      wx.playBackgroundAudio({
        dataUrl: music.url,
        title: music.title,
        coverImgUrl: music.coverImg
      })
    }else{
      wx.pauseBackgroundAudio();
    }
  },

  /*监听收藏按钮的轻敲事件* */
  changeCollect:function(){
    // console.log("collect");
    // this.setData({
    //   collected:!this.data.collected
    // })
    var newsId = this.data.newsId;
    // console.log(newsId);
    // wx.setStorageSync(newsId, this.data.collected);
    var collected = !this.data.collected;
    wx.showModal({
      title: '文章收藏',
      content: collected?"你是否收藏该文章":"你是否取消收藏该文章",
      showCancel: true,
      cancelText: '否',
      cancelColor: '#aaa',
      confirmText: '是',
      confirmColor: '#405f80',
      success:(res) => {
        if(res.confirm){
          this.setData({
            collected:collected
          })
          try{
            wx.setStorageSync(newsId, collected)
          }catch(e){
            wx.showToast({
              title: collected?'收藏失败':"取消收藏失败",
            })
          }
          

          wx.showToast({
            title: collected ? "收藏成功" : "取消收藏成功",
            icon: 'success'
          })

        }else{
          // 按下取消键
          wx.showToast({
            title: '已取消该项操作'
          })
        }
      }
    })




    // wx.showModal({
    //   title: '收藏文章',
    //   content: '你确定收藏该文章吗？',
    //   showCancel: true,
    //   cancelText: '否',
    //   cancelColor: 'blue',
    //   confirmText: '是',
    //   confirmColor: 'red',
    //   success: function(res) {
    //     console.log(res);
    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })

    // wx.showToast({
    //   title: '收藏成功',
    //   icon: 'success',
    //   duration: 1500,
    //   mask: true
    // })


    // wx.showLoading({
    //   title: '加载中'
    // })
    // setTimeout(function(){
    //   wx.hideLoading();
    // },2000)


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var newsId = options.newsId;
    this.setData({
      news:data.newsList[newsId],
      newsId:newsId
    })

    // bug1:当外部控制器改变了音乐的播放状态，本页面中自定义按钮状态未改变
    // 解决方法：添加对音乐播放状态的监听
    // bug2:音乐处于播放 状态时，此时切回还是上一页再切回时，以音乐播放按钮与当前播放状态不一致
    // 解决方案：在全局变量里设置isPlaying
    // bug3:音乐播放时，切到其他新闻详情页，播放按钮状态不一致
    // 解决方案：通过全局变量newsId,保存正在播放的音乐的新闻ID

    if(newsId == app.globalData.newsId && app.globalData.globalIsPlay){
      this.setData({
        isPlaying:true
      })
    }else{
      this.setData({
        isPlaying:false
      })
    }

    wx.onBackgroundAudioPlay(() => {
      // 音乐播放的回调
      this.setData({
        isPlaying:true
      })
      app.globalData.globalIsPlay = true;
      app.globalData.newsId = newsId;
    })
    wx.onBackgroundAudioPause(() => {
      // 音乐暂停的回调
      this.setData({
        isPlaying: false
      })
      app.globalData.globalIsPlay = false;
      app.globalData.newsId = -1;
    })



    wx.getStorage({
      key: newsId,
      success: (res) => {
        if(res.data !== undefined){
          this.setData({
            collected:res.data
          })
        }
      }
    })

    
   


    /*// 异步设置缓存
    wx.setStorage({
      key: 'userId',
      data: 10001,
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {},
      complete: function(res) {},
    })

    // 同步设置storage
    wx.setStorageSync("username", "hello world");*/

    // 获取storage
    // wx.getStorage({
    //   key: 'username',
    //   success: function(res) {
    //     console.log(res);
    //     var username = res.data;
    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })

    // var username = wx.getStorageSync("username")
    // console.log(username);

    // var res = wx.getStorageInfoSync();
    // console.log(res);


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