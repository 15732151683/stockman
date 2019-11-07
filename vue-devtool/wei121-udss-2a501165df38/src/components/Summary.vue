<template>
  <div class="swiper-container swiper-container-parent">
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        Slide 1
        <div class="swiper-container swiper-container-children">
          <div class="swiper-wrapper">
            <div class="swiper-slide">child 1</div>
            <div class="swiper-slide">child 2</div>
            <div class="swiper-slide">child 3</div>
          </div>
          <!--<div class="swiper-button-next"></div>-->
          <!--<div class="swiper-button-prev"></div>-->
          <div class="swiper-pagination"></div>
        </div>
      </div>
      <div class="swiper-slide">Slide 2</div>
      <div class="swiper-slide">Slide 3</div>
      <div class="swiper-slide">Slide 4</div>
      <div class="swiper-slide">Slide 5</div>
      <div class="swiper-slide">Slide 6</div>
      <div class="swiper-slide">Slide 7</div>
      <div class="swiper-slide">Slide 8</div>
      <div class="swiper-slide">Slide 9</div>
      <div class="swiper-slide">Slide 10</div>
    </div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
//  import $ from 'jquery'
  import Swiper from 'swiper'
  import '../../node_modules/swiper/dist/css/swiper.min.css'

  export default {
    name: 'Summary',
    data () {
      return {
        hello: 'worl'
      }
    },
    mounted () {
      this.$nextTick(function () {
        console.log(new Swiper('.swiper-container-parent', {
          pagination: '.swiper-pagination',
//          direction: 'vertical',
//          slidesPerView: 1,
          paginationClickable: true
//          spaceBetween: 30,
//          mousewheelControl: true
        }))
        console.log(new Swiper('.swiper-container-children', {
          pagination: '.swiper-pagination',
          paginationClickable: true,
          direction: 'vertical',
          mousewheelControl: true
//          prevButton: '.swiper-button-prev',
//          nextButton: '.swiper-button-next'
        }))
      })
    },
    methods: {
      resize () {}
    }
  }
</script>

<style scoped>
  .swiper-container {
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
  }
  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;
  }
</style>
