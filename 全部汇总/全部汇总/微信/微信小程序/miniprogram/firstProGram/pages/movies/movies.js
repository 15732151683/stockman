var getData=require("../../utils/util.js").getData;
var formatStars = require("../../utils/format.js").formatStars;
var app = getApp();
// pages/movies/movies.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    in_theaters:{},
    coming_soon:{},
    top250:{},
    isSearching:false
  },
  //开始聚焦搜索
  beginSearch(){
    this.setData({
      isSearching:true
    })
  },
  //结束聚焦
  stopSearch(){
    this.setData({
      isSearching: false
    })
  },
  // 封装请求方法
  fetchData(url,key,title){
    getData(url).then(({data})=>{
      console.log(data);
      var source=data.subjects;
      this.formatData(source,key,title)
      //格式化数据
    }).catch(err=>{
      console.log(err)
    })
  },
  // 格式化数据
  formatData(source,key,title){
    var temp = [];
    for(var i in source){
      var obj={
        movieId:source[i].id,
        movieImg: source[i].images.large ? source[i].images.large:"",
        title:source[i].title,
        score:source[i].rating.average,
        stars:formatStars(source[i].rating.stars)
      }
      temp.push(obj);
    }
    var tempObj={
      groupTitle:title,
      movies:temp,
      key:key
    }
    var setSource={}
    setSource[key] = tempObj;
    this.setData(setSource);
    console.log(tempObj);

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //正在热映
    var commonUrl = app.globalData.url;
    var url = commonUrl +"in_theaters?count=3";
    this.fetchData(url, "in_theaters","正在热映");

    //即将上映
    var url = commonUrl + "coming_soon?count=3";
    this.fetchData(url, "coming_soon","即将上映");

    //top250
    var url = commonUrl + "top250?count=3";
    this.fetchData(url, "top250","top250");
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