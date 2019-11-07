var data=require('../../data/posts-data.js');
var app=getApp();
Page({
  data: {
    newsList:data.newsList,
    imgUrls: [
      '../../images/iqiyi.png',
      '../../images/vr.png',
      '../../images/wx.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000
  },
  goToNewsDetail(e){
    var newsId=e.currentTarget.dataset.newsId
    wx.navigateTo({
      url: `./news-detail/news-detail?newsId=${newsId}`,
    })
  },
  onLoad(){
    console.log(app)
  }

})