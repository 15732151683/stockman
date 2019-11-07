<?php
//从数据库请求数据
//连接数据库
include "connect.php";
//执行查询
//如果是select语句,该函数返回一个结果集对象,通过该对象可以获取查询的记录
$sql = "select * from nvshen";   //就是一串字符串,mysql代码语句

//如何实现翻页
//翻页需要知道: 1.总的条数,  2.每页显示多少条
//如何获得总条数?-->使用mysql的内置函数count,参数可以是一个*,也可以是某一个特定的例子,建议使用count(主键),比如 count(stu_id)这种的
$countSql = "select count(nvshen) from nvshen";
$countResult = mysqli_query($link, $countSql);
$count = mysqli_fetch_array($countResult, MYSQLI_NUM);
$totalNvshen = $count[0];//count(id)在sql语句中是第一个字段,也就是下标为0
//已知总条数,求分页数
//首先确定每页显示多少条
$pageSize = 5;//每页显示5条
//13/5=2.6
$allPages = ceil($totalNvshen / $pageSize); //向上取整  
echo "符合要求的女神共有$totalNvshen 条,一共显示$allPages 页";
//有了分页计算每页显示的起始与结束位置
//每一页显示哪一条到哪一条
//limit $start, $limit  (起始位置,显示多少条)
//第一条的索引 = 0;第一页的start应该是0,第二页的start应该是5,第三页的start应该是10
$pageIndex = 1;
$start = ($pageIndex - 1)*$pageSize;
//所有的学生
//limit
//$limit = array($start,$pageSize);
//$datas = $newdb->select("")

//$sql = "select * from nvshen";
$sql .=" limit $start, $pageSize";
echo $sql;
$result = mysqli_query($link, $sql);
$datas = mysqli_fetch_all($result);
//var_dump($datas);
//foreach($datas as $data){
//	$data[0]= array(
//		$data[1] => $data[2]
//	);	
//}
//$funcname = $_POST['callback'];
//echo "$funcname(".json_encode($nsArr).")";  //传回去的是二维数组
//总结php+mysql步骤
//连接数据库  connect.php
//根据业务要求书写sql语句(案例中的$sql);
//将sql语句提交给sql服务器执行
//根据sql服务器的执行结果继续操作
//如果是select语句,根据返回的结果集对象获取结果
//获取全部数据使用mysqli_fetch_all
//逐行获取使用mysqli_fetch_array
?>
<table>
	<tr>
		<td>女神id</td>
		<td>女神姓名</td>
		<td>女神年龄</td>
		<td>编辑</td>
		<td>删除</td>
	</tr>
	<?php
		foreach($datas as $data){
			//mysqli_fetch_array   --逐条获取,美都区一行之后,指针指向吓一条
			while($data=mysqli_fetch_array($result,MYSQLI_NUM)){
				
			
		?>	
	<tr>
		<td><?=$data[0]?></td>
		<td><?=$data[1]?></td>
		<td><?=$data[2]?></td>
		<td><a href="edit.php?id=<?=$data[0]?>">编辑</a></td>
		<td><a href="del.php?id=<?=$data[0]?>">删除</a></td>
	</tr>
	<?php }} ?>
</table>