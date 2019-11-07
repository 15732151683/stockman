<?php if (!defined('THINK_PATH')) exit();?><html lang="zh-CN">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  
  <title>图书展示</title>

  <link rel="stylesheet" href="/BookStore/Public/common/css/normalize.css">
  
    <link rel="stylesheet" href="/BookStore/Public/common/css/nav.css">
<link rel="stylesheet" href="/BookStore/Public/common/css/footer.css">
  
  
  <link rel="stylesheet" type="text/css" href="/BookStore/Public/common/css/bootstrap.css" />
  <link rel="stylesheet" type="text/css" href="/BookStore/Public/css/bookList.css" />

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
    <ul class="booklist">
      <?php if(is_array($data)): $i = 0; $__LIST__ = $data;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$item): $mod = ($i % 2 );++$i;?><li class="bookitem">
          <a href="/BookStore/home/book/bookDetails?id=<?php echo ($item["id"]); ?>">
            <img src="<?php echo ($item["imgUrl"]); ?>" />
          </a>
          <h2><?php echo ($item["bookName"]); ?></h2>
          <p>
            <span>价格:￥<?php echo ($item["price"]); ?></span>
            <a href="javascript:void(0)" index=<?php echo ($item["id"]); ?>>加入购物车</a>
          </p>
        </li><?php endforeach; endif; else: echo "" ;endif; ?>
    </ul>

    <ul class="pagination">
      <?php echo ($page); ?>
    </ul>
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
    $(".wrap .bookitem p a").click(function(){
      add($(this).attr('index'))
    })
  </script>

</body>

</html>