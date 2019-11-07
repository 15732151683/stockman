<?php
/*基础语法部分*/
/*输出
 
/* 所谓输出:就是服务器将数据传递给某个终端,比如浏览器,称为输出到浏览器,当访问某个PHP文件,php脚本执行后,输出到浏览器,在浏览器端是看不到php的任何代码的
 *因为:  浏览器是客户端,运行在用户的电脑上,而php是服务端语言,在服务端运行,浏览器里面看到的是运行结果
 * */
/*基本输出语句 echo*/
echo "hello Xiaoyingying"."<br>";
/*输出语句 :  print
 *与echo的区别是: print具有返回值
 * */
print("hello Xiaoyingying");
/*赋值语句
 *变量名 = 值
 * php的变量名以$开始*/
$var  = 10;  //将数字10赋值给变量var

?>
<h3>
	在php文件里面可以直接写html标签,但是要在标记之外,html部分会与php执行结果一起输出到浏览器
</h3>
<?php
	echo "php与js一样,可以有多段php脚本";
?>
<style type="text/css">
	td{border: 1px solid #000;}
</style>
<table>
	<tr>
		<td></td>
		<td>javascript</td>
		<td>php</td>
	</tr>
	<tr>
		<td>运行位置</td>
		<td>浏览器上(node.js是在服务器上)</td>
		<td>服务器上</td>
	</tr>
	<tr>
		<td>标记</td>
		<td>script</td>
		<td>php</td>
	</tr>
	<tr>
		<td>关于语句分号符</td>
		<td>;不是必须的</td>
		<td>;是必须的</td>
	</tr>
	<tr>
		<td>是否可以混编</td>
		<td>是</td>
		<td>是</td>
	</tr>
	<tr>
		<td>关于变量定义</td>
		<td>无前缀 var let</td>
		<td>必须使用$作为前缀</td>
	</tr>
</table>