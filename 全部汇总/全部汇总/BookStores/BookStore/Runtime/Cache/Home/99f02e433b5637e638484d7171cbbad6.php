<?php if (!defined('THINK_PATH')) exit();?><html lang="zh-CN">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  
  <title>添加图书</title>

  <link rel="stylesheet" href="/BookStore/Public/common/css/normalize.css">
  
    <link rel="stylesheet" href="/BookStore/Public/common/css/nav.css">
<link rel="stylesheet" href="/BookStore/Public/common/css/footer.css">
  
  
  <link rel="stylesheet" type="text/css" href="/BookStore/Public/css/addBook.css" />

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
    <h1>添加图书</h1>
    <div>
      <table class="addBook" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td>书名:</td>
          <td>
            <input type="text" name="bookName" placeholder="书名" />
          </td>
        </tr>
        <tr>
          <td>简介:</td>
          <td>
            <input type="text" name="bookIntro" placeholder="简介" />
          </td>
        </tr>
        <tr>
          <td>作者:</td>
          <td>
            <input type="text" name="author" placeholder="作者" />
          </td>
        </tr>
        <tr>
          <td>出版社:</td>
          <td>
            <input type="text" name="publisher" placeholder="出版社" />
          </td>
        </tr>
        <tr>
          <td>出版日期:</td>
          <td>
            <input type="text" name="publicationDate" placeholder="出版日期" />
          </td>
        </tr>
        <tr>
          <td>价格:</td>
          <td>
            <input type="text" name="price" placeholder="价格" />
          </td>
        </tr>
        <tr>
          <td>ISBN:</td>
          <td>
            <input type="text" name="ISBN" placeholder="ISBN" />
          </td>
        </tr>
        <tr>
          <td>书籍图片:</td>
          <td>
            <input type="file" name="pic" />
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <input type="button" value="添加" style="margin: 10px 20px;width: 60px;font-size: 20px;">
          </td>
        </tr>
      </table>
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
      let arr = ['bookName', 'bookIntro', 'author', 'publisher', 'publicationDate', 'price', 'ISBN']

      $('.wrap .addBook td input[type=button]').click(function(){
        let tmp = {}
        $('.wrap .addBook td input[type=text]').each(function(i, item){
          let val = $(item).val()
          tmp[arr[i]] = val ? val : '暂无信息'
        })
        let val = $('.wrap .addBook td input[type=file]')[0].files[0]
        tmp['file'] = val ? val : ''
        let formData = new FormData();
        for (item in tmp) {
          formData.append(item, tmp[item])
        }

        $.ajax('/BookStore/home/book/addBook', {
          async: true,
          type: 'post',
          dataType: 'json',
          processData: false,
          contentType: false,
          data: formData,
          success: function (res) {
            if(res.succeed){
              alert(res.message)
            }else {
              alert(res.message)
            }
          }
        })
      });


    })
  </script>

</body>

</html>