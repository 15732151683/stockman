<?php if (!defined('THINK_PATH')) exit();?><html lang="zh-CN">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  
  <title>首页</title>

  <link rel="stylesheet" href="/BookStore/Public/common/css/normalize.css">
  
    <link rel="stylesheet" href="/BookStore/Public/common/css/nav.css">
<link rel="stylesheet" href="/BookStore/Public/common/css/footer.css">
  
  
    <link rel="stylesheet" type="text/css" href="/BookStore/Public/css/index.css" />

</head>

<body>
  <!-- 顶部导航栏 -->
  
    <div class="nav">
  <div class="header">
    <div class="left">
      <div class="brand">
        书吧
      </div>
    </div>
    <div class="right">
      <ul>
        <li class="active"><a href="/BookStore/home/index/index">网站首页</a></li>
        <li><a href="">关于我们</a></li>
        <li><a href="/BookStore/home/index/bookList">图书展示</a></li>
        <li><a href="">联系我们</a></li>
        <li><a href="/BookStore/home/index/bookCart">购物车</a></li>
        <li><a href="/BookStore/home/index/addBook">添加图书</a></li>
      </ul>
    </div>
  </div>
</div>
  

  <!-- 中间内容 -->
  
  <div class="main">
    <div class="left">
      <div class="intro">
          <h1>我的书城</h1>
          <h3>这里拥有世界各地的书籍，只有你想不到，没有我们这里没有的图书。</h3>
          <img src="/BookStore/Public/images/1.jpeg" alt="我的书城">
      </div>
    </div>
    <div class="right">
      <?php
 if(empty($_SESSION)){ ?>
        <p>快速登录</p>
        <form>
            <input type="text" class="size" name="username" placeholder="用户名"><br>
            <input type="password" class="size" name="password" placeholder="密码"><br>
            <input type="button" class="btn" value="登录">
            <input type="button" class="btn" value="注册">
        </form>
      <?php
 } else { ?>
          <p>欢迎<?=$_SESSION['user']['username']?>访问网站</p>
      <?php
 } ?>
    </div>
  </div>


  <!-- 底部 -->
  
      <div class="footer">
  <div class="top">
    <ul>
      <li>免费条款</li>
      <li>隐私保护</li>
      <li>资讯热点</li>
      <li>联系我们</li>
      <li>公司简介</li>
      <li>批发方案</li>
      <li>配送方案</li>
    </ul>
  </div>
  <div class="bottom">
    <p>&copy;2016-2999 SSS版权所有，并保留所有权利</p>
  </div>
</div>
  

  <!-- jq引入 -->
  <script type="text/javascript" src="/BookStore/Public/common/js/jquery.min.js"></script>
  <script type="text/javascript" src="/BookStore/Public/common/js/switchTab.js"></script>
  <!-- 自写js -->
  
  <script>
    $(function(){
      $('.btn:first').click(function(){
        $.post('/BookStore/home/user/login', {
          'username': $('.main .right form input:text').val(),
          'password': $('.main .right form input:password').val(),
        }, function(res) {
          if(res.succeed){
            alert(res.message)
            $('.main .right').html("<p>欢迎" + res.info + "访问网站</p>")
          }else {
            alert(res.message)
          }
        }, 'json')
      })

      $('.btn:last').click(function(){
        location.href = "register"
      })
    })
  </script>

</body>

</html>