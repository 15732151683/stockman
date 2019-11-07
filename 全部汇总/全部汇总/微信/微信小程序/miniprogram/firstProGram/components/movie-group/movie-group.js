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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToMore(e){
      var key =e.currentTarget.dataset.groupKey;
      var title = e.currentTarget.dataset.groupTitle
      wx.navigateTo({
        url: `./movies-more/movies-more?title=${title}&key=${key}`
      })
    },
    goToDetail(e){
      var id = e.currentTarget.dataset.id;
      console.log(e)
      wx.navigateTo({
        url: `./movies-detail/movies-detail?id=${id}`
      })
    }
  }
})
