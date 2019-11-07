var getData = require("../../../utils/util.js").getData;
var formatStars = require("../../../utils/format.js").formatStars;
// pages/movies/movies-more/movies-more.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieMore:{}
  },
  // 封装请求方法
  fetchData(url, key, title) {
    getData(url).then(({ data }) => {
      console.log(data);
      var source = data.subjects;
      this.formatData(source, key, title)
      //格式化数据
    }).catch(err => {
      console.log(err)
    })
  },
  formatData(source, key, title) {
    var temp = [];
    for (var i in source) {
      var obj = {
        movieId: source[i].id,
        movieImg: source[i].images.large ? source[i].images.large : "",
        title: source[i].title,
        score: source[i].rating.average,
        stars: formatStars(source[i].rating.stars)
      }
      temp.push(obj);
    }
    var tempObj = {
      groupTitle: title,
      movies: temp,
      key: key
    }
    this.setData({
      movieMore: tempObj
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var commonUrl = app.globalData.url;
    var url = commonUrl + options.key;
    this.fetchData(url, options.key, options.title);
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
    console.log("下拉刷新");
    this.fetchData(0);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("触底了");
    this.fetchData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})