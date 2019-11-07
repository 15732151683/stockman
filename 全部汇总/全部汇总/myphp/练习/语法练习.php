<?php
//定义一个变量,并且把它赋值为100;
$caicai = 10086;
echo $caicai;
?>
<!--使用PHP中定义的变量-->
<div>你这次又拨打了<?=$caicai;?></div>
<script type="text/javascript">
	var caicai2 = 1008611;
	var v = <?php echo $caicai;?>;
	console.log(v);
</script>