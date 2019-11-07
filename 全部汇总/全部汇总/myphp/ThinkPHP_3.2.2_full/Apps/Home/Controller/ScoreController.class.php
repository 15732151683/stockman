<?php
namespace Home\Controller;
use Think\Controller;
use Think\Page;
use Home\Model\ScoreModel;
class scoreController extends Controller{
	public function _initialize(){
		$this->scoreModel = new ScoreModel();//实例化
	}
	public function add(){
		if(!empty($_POST)){
			$fields = array(
				'js'=>$_POST['js'],
				'php'=>$_POST['php'],
				'java'=>$_POST['java'],
				'python'=>$_POST['python'],
				'c'=>$_POST['c++']
			);
			$this->scoreModel->add($fields);
		}else{
			$this->display('index');
		}
	}
	public function show(){
		if(!empty($_GET)){
			$count = $this->scoreModel->count();
			$page = new Page($count,3);
			$datas = $this->scoreModel->limit($page->firstRow.",".$page->listRows)->select();
			echo json_encode($datas);
		}else{
			$this->display("list");
		}
	}
	public function count(){
		//$count = $this->scoreModel->count();
		//$page = new Page($count,3);
		$count = ceil(($this->scoreModel->count()-0)/3);//转换前端拿到的数据类型
		echo json_encode($count);
	}
	public function update(){
		if(!empty($_POST)){
			$fields = array(
				'js'=>$_POST['js'],
				'php'=>$_POST['php'],
				'java'=>$_POST['java'],
				'python'=>$_POST['python'],
				'c'=>$_POST['c++']
			);
			$this->scoreModel->where("id=".$_POST['id'])->save($fields);
		}else{
			$data = $this->scoreModel->where("id=".$_GET['id'])->find();
			$this->assign('data',$data);
			$this->display("edit");
		}
	}
	public function delete(){
		$this->studentModel->where("stu_id=".$_GET['id'])->delete();
	}
}
?>