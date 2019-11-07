<?php if (!defined('THINK_PATH')) exit();?><html lang="zh-CN">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  
  <title>《<?php echo ($data["b_name"]); ?>》图书详情</title>

  <link rel="stylesheet" href="/BookStore/Public/common/css/normalize.css">
  
    <link rel="stylesheet" href="/BookStore/Public/common/css/nav.css">
<link rel="stylesheet" href="/BookStore/Public/common/css/footer.css">
  
  
  <link rel="stylesheet" type="text/css" href="/BookStore/Public/css/bookInfo.css" />

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
  
    <div class="wrap">
        <img src="<?php echo ($data["b_imgpath"]); ?>" alt="" />
        <div class="bookInfo">
          <h2><?php echo ($data["b_name"]); ?></h2>
          <p><?php echo ($data["b_intro"]); ?></p>
          <ul class="intro">
            <li>作者：<span><?php echo ($data["b_author"]); ?></span></li>
            <li>出版社：<span><?php echo ($data["b_press"]); ?></span></li>
            <li>出版时间：<span><?php echo ($data["b_publicationdate"]); ?></span></li>
            <li>国际标准书号ISBN：<span><?php echo ($data["b_isbn"]); ?></span></li>
            <li>友情价格：<span><?php echo ($data["b_price"]); ?></span></li>
          </ul>
          <a href="javascript:void(0)">加入购物车</a>
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
  
  <script src="/BookStore/Public/common/js/add.js"></script>
  <script>
    $('.bookInfo>a').click(function(){
      add(<?php echo ($data["b_id"]); ?>)
    })
  </script>

</body>

</html>