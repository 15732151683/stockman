// pages/movies/movie-detail/movie-detail.js
var app = getApp();
var getData = require("../../../utils/http.js").getData;
var format = require("../../../utils/format.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie:{}
  },
  // 格式化data
  formatData(data){
    var temp = {
      title:data.title,
      coverImg: data.images.large ? data.images.large:"",
      year:data.year,
      wishCount:data.wish_count,
      reviewsCount:data.reviews_count,
      originTitle:data.original_title,
      stars:format.formatStars(data.rating.stars),
      score:data.rating.average,
      director: data.directors[0] ? data.directors[0].name:"",
      casts:format.formatCasts(data.casts),
      genres:data.genres.join("、"),
      summary: data.summary ? data.summary:"",
      castsInfo:format.formatCastsInfo(data.casts)
    }

    this.setData({
      movie:temp
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var movieId = options.movieId;
    var url = `${app.globalData.url}subject/${movieId}`;
    getData(url).then(({data}) => {
      console.log(data);
      this.formatData(data);
    }).catch((err) => {
      console.error(err);
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