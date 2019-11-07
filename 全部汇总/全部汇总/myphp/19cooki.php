<?php
//http协议是一个无状态协议，就是无法通过协议传输来识别用户，即使你再瞬间同时向服务器发起两个请求，在服务器看来，两个请求并不是同一个人，而是独立的两个请求
//在互联网应用中，通常需要识别用户，跟踪用户信息，比如商城购物
//为了解决这个问题没互联网组织设计了cookie，cookie是在用户电脑端存储的一小段文件数据，在每一次http请求的时候，该cookie都会随http请求头发往服务器，而服务器向客户端返回数据时，同样返回cookie
//cookie是可以同时被服务端和客户端读取与修改的
//cookied路径（path） -  如果设置COOKIE的时候没有设置路径，那么COOKIE的路径就是没设置COOKIE文件所在的路径
//COOKIE只能被COOKIE路径内的子目录包含本级目录访问，上一级目录无法访问到子目录的COOKIE
//COOKIE是有生命期的，如果设置的cookie的时候没有指定过期时间，那么COOKIE将在浏览器关闭后失效
//domain  -  如果一个网站拥有子域名，比如www.lanou3g.com,edu.lanou3g.com，如果想这些子站COOKIE能够互相读取，需要设置COOKIE的domain为lanou3g.com
//在前端使用js设置的cookie将在下一次请求中生效（页面按刷新后生效）
//控制cookie的个数，浏览器对每个站点的COOKIE数有限制（具体的浏览器具体的限制不同），cookie里尽量存放少量的必要的数据（浏览器对COOKIE大小有限制），COOKIE超出限制之后可能会被删除，导致无法正常访问cookie
//前端每一次向后台发送请求的时候也同时发送cookie给后台，所以浏览器必定会对cookie的大小进行限制，否选择影响效率
//敏感信息都不能放在COOKIE里面

//服务端设置COOKIE
setcookie("user","doubi");
//在服务器端使用$_COOKIE[]数组
var_dump($_COOKIE);
?>
<!--客户端可以使用js读取cookie-->
<script type="text/javascript">
	//使用document.cookie获得cookie
	console.log(document.cookie);
</script>