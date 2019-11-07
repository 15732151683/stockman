<?php
namespace Home\Controller;
use Think\Controller;

class CartController extends Controller{
	//添加商品
	function add(){
		//前端传来的购物车添加信息
		$id = $_GET['id'];
		$num = $_GET['num'];
		if(empty($_SESSION['cart'][$id])){
			$_SESSION['cart'][$id] = $num;
		}else{
			$_SESSION['cart'][$id] += $num;
		}
		print_r($_SESSION);
	}
	//购物车列表
	function getList(){
		$ids = array();
		foreach($_SESSION['cart'] as $key=>$val){
			$ids[] = $key;
		}
		$ids = implode(",",$ids);
		//相当于在顶部使用use  Home\Model\StudentModel
		$studentModel = new \Home\Model\StudentModel();
		$students = $studentModel->where("stu_id in ($ids)")->select();
		$this->assign("students",$students);
		$this->display("cart");
	}
}
?>