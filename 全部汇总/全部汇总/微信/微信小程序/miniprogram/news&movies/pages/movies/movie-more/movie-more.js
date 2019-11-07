// pages/movies/movie-more/movie-more.js
var app = getApp();
var getData = require("../../../utils/http.js").getData;
var formatStars = require("../../../utils/format.js").formatStars;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key:"",
    movies:[],
    start:0,
    noResult:false
  },
  /**获取数据 */
  fetchData(start){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.showNavigationBarLoading();
    var key = this.data.key;
    var url = `${app.globalData.url}${key}?start=${start}&count=12`;
    getData(url).then(({data}) => {
      console.log(data);
      // 当总数小于下一次查找起点时，设置不能再次发起请求
      if(data.total < start + 12){
        this.setData({
          noResult:true
        })
      }
      var temp = this.formatData(data.subjects);
      if(start == 0){
        // 刷新的
        var movies = temp;
      }else{
        var movies = this.data.movies.concat(temp);
      }
      this.setData({
        movies:movies,
        start:start
      })
      wx.hideLoading();
      wx.hideNavigationBarLoading();

    }).catch((err) => {
      console.error(err);
    })
  },
  formatData(source){
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
    console.log(source)
    return temp;

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var title = options.title;
    var key = options.key;
    console.log(title,key);
    this.setData({
      key:key
    })
    // 设置导航栏的标题
    wx.setNavigationBarTitle({
      title: title
    })
    // http://api.douban.com/v2/movie/in_theaters?start=0?count=12
    this.fetchData(0);
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
    if(this.data.noResult){
      return;
    }
    var start = this.data.start + 12;
    this.fetchData(start);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})