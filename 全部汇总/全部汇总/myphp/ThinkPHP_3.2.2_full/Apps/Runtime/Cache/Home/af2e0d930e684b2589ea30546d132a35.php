<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<!--
	学面向对象经历的几个阶段: 1.不习惯----由面向过程转向面向过程
	2.面向对象主要是属性与方法,可以从某个方法具体的看起,分析它的参数,他的返回值,了解他要实现的功能
	3.能够使用某方法实现业务逻辑
	4.了解一个对象的方法组成
	5.感叹生活
	
	
-->
	<head>
		<meta charset="UTF-8">
		<title></title>
		<style>
			ul {
				display: flex;
			}
			.title{
				height: auto;
				margin: 0;
			}
			.title li{
				height: 50px;
			}
			li {
				list-style: none;
				width: 100px;
				height: 100px;
				border-top: 1px solid;
				text-align: center;
				line-height: 50px;
			}
			
			.fenye span {
				padding: 10px;
				border: 1px solid;
				cursor: pointer;
			}
			img{
				width: 100px;
				height: 100px;
			}
		</style>
	</head>

	<body>
		<div class="stu">
			
		</div>
		<div class="fenye">
			<a href="javascript:changePage(-1)">上一页</a>
			<a href="javascript:getData(1)">1</a>
			<a href="javascript:getData(2)">2</a>
			<a href="javascript:changePage(1)">下一页</a>
		</div>
		<script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
		<script type="text/javascript">
			//默认起始页为1
			var pageIndex = 1;
			var pageSize;
			var allpages;
			//原生翻页效果
			function createPageNav(){
				//生成翻页导航
				//页号不能小于0,不能大于总页数
				//显示当前页居中
				//每一次请求之后,都要重新执行该函数
			}
			//如果想翻页,name就会改变页号,然后重新请求
			//getData函数专门处理ajax,传的参数就是页号
			getData(1);
			//changePage(-1);
			//changePage(1);
			function changePage(type){
				pageIndex = pageIndex + type;
				getData(pageIndex);
			}
			//如果想翻页,改变页号重新请求
			//封装函数 页号为形参
			function getData(pageIndex) {
				$.ajax({
					type: "get",
					data: {
							p: pageIndex
						},
					url: "index.php?m=home&c=student&a=getList",
					dataType: "json",
					async: true,
					success: function(data) {
						console.log(data);
						//创建节点
						var len = data.length;
						var lis = `<ul class="title">
									<li>头像</li>
									<li>姓名</li>
									<li>性别</li>
									<li>院系</li>
									<li>城市</li>
									<li>年龄</li>
									<li>操作</li>
								</ul>`;
						//数组的话,for in 也很好用的 foreach 
						for(var i = 0; i < len; i++) {
							lis += `<ul>
									<li>
										<img src="${data[i].pic}" alt="学生头像"/>
									</li>
									<li>${data[i].name}</li>
									<li>${data[i].sex}</li>
									<li>${data[i].college}</li>
									<li>${data[i].city}</li>
									<li>${data[i].age}</li>
									<li><a href="index.php?m=home&c=student&a=update&id=${data[i].stu_id}">编辑</a>
									<a href="del.php?id=${data[i].stu_id}">删除</a>
									<a href="javascript:addCart(${data[i].stu_id})">添加到购物车</a>
									</li>
									
								</ul>`;
						}
							$(".stu").html(lis);
						}
					});
				};
			function addCart(id){
				$.ajax({
					type:"get",
					url:"index.php?m=home&c=cart&a=add",
					async:true,
					dataType:"json",
					data:{
						id:id,
						num:1
					},
					success:function(data){
						console.log(data);
					}
				});
			}
		</script>
	</body>

</html>