var getData = require("../../../utils/util.js").getData;
var formatStars = require("../../../utils/format.js").formatStars;
var app = getApp();
// pages/movies/movies-detail/movies-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:{},
    stars:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var id = options.id;
    var commonUrl = app.globalData.url;
    var url = commonUrl + `subject/${id}`;
    getData(url).then(({ data }) => {
      console.log(data);
      this.formatData(data)
    }).catch(err => {
      console.log(err)
    })
  },
  //格式化数据
  formatData(source) {
    var temp = source;
    temp.name=[];
    temp.rating.stars=formatStars(temp.rating.stars)
    temp.genres=temp.genres.join("、")
    for (var i = 0; i < temp.casts.length;i++){
      temp.name.push(temp.casts[i].name)
    }
    temp.name=temp.name.join("/")
    console.log(temp);
    this.setData({
      result:temp,
      stars: temp.rating.stars
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