<table>
	<tr>九九乘法表</tr>
<?php
for($i= 1;$i<10;$i++){
?>
	<tr>
		<?php
		for($j=1;$j<=$i;$j++){
		?>
		<td><?php echo "$i*$j=";echo $i*$j;?></td>
		<?php } ?>
	</tr>
	<?php } ?>
</table>