// components/movie-group/movie-group.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    movies:{
      type:Array
    },
    movieGroup:{
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    val: 1

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToDetail:function(e){
      var movieId = e.currentTarget.dataset.movieId;
      // console.log(movieId);
      wx.navigateTo({
        url: '/pages/movies/movie-detail/movie-detail?movieId='+movieId
      })
    },
    goToMore:function(e){
      var title = e.currentTarget.dataset.title;
      var key = e.currentTarget.dataset.key;
      wx.navigateTo({
        url: `/pages/movies/movie-more/movie-more?title=${title}&key=${key}`,
      })
    }
  },
  onLoad: function (options) {
    console.log(this.properties.movieGroup)
    console.log('ces33333333333333333')
  },
  onShow: function () {
    console.log(444)
    console.log(this.movieGroup, 33333)
  },
  created: function (){
    console.log('creat', this.data, '111')
  },
  attached: function () {
    console.log('ayyach', this.data, '111')
  },
  lifetimes: {
    attached: function () {
      console.log(this.data, '232')
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  detached: function () {
    // 在组件实例被从页面节点树移除时执行
  },
})
