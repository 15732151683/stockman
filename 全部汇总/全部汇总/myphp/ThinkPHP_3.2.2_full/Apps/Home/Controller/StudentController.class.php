<?php
namespace Home\Controller;
use Think\Controller;
use Think\Page;//导入文件
use Home\Model\StudentModel;
class studentController extends Controller{
	public function index(){
		$this->show("my studentController","utf-8");
	}
	//在实现登陆之前，这里是public function show(){}
	public function getList(){
		if(!empty($_GET)){
			$count = $this->studentModel->count();
			//$_GET['p'] = 2;  //如果固定了$_GET那么翻页就没有效果了,只会在固定的那一页
			$page = new Page($count,3);   //联系use Think\Page;//导入文件
			//当前页 pageIndex
			//默认使用 p
			$datas = $this->studentModel->limit($page->firstRow.",".$page->listRows)->select();
			echo json_encode($datas);
		}else{
			//list指向的是   view\student\list.html
			$this->display("list");
		}
	}
	public function _initialize(){
		$this->studentModel = new StudentModel();  //实例化对象
	}
	//add增加数据
	public function add(){
		//register.html添加操作
		if(!empty($_POST)){
		$fields = array(
			'name'=>$_POST['name'],
			'sex'=>$_POST['gender'],
			'age'=>$_POST['age'],
			'college'=>$_POST['college'],
			'city'=>$_POST['city'],
			'pic'=>''
		);
		
		//$studentModel = new StudentModel();  //实例化对象
		$this->studentModel->add($fields);
		}else{
			//定义一组院校选项
			$college = array(
				1=>"美术学院",
				2=>"音乐学院",
				3=>"物电",
				4=>"外国语",
				5=>"生化"
			);
			//把$college赋值到模板
			$this->assign("college",$college);
			$city = array(
				1=>"北京",
				2=>"上海",
				3=>"武汉",
				4=>"江苏",
				5=>"浙江"
			);
			$this->assign("city",$city);
			$this->display("register");
		}
		
	}
	//delete删除数据
	public function delete(){
		//$studentModel = new StudentModel();  //实例化对象
		//$studentModel->delete(50);
		//表中的主键名是什么就写什么  e.g.stu_id
		$this->studentModel->where("stu_id=".$id)->delete();
	}
	//数据更新
	//$id = $_GET['id'];
	public function update(){
		//$studentModel = new StudentModel();  //实例化对象
		if(!empty($_POST)){//传数据用post
			$fields = array(
				'name'=>$_POST['name'],
				'sex'=>$_POST['gender'],
				'age'=>$_POST['age'],
				'college'=>$_POST['college'],
				'city'=>$_POST['city'],
				'pic'=>''
			);
			$this->studentModel->where("stu_id=47")->save($fields);
		}else{
			//所以点击列表中的编辑a链接,通过href拼接id所以用get啦
			//取出旧的数据
			$data = $this->studentModel->where("stu_id=".$_GET['id'])->find();
			
			//定义一组院校选项
			$college = array(
				1=>"美术学院",
				2=>"音乐学院",
				3=>"物电",
				4=>"外国语",
				5=>"生化"
			);
			//把$college赋值到模板
			$this->assign("college",$college);
			$city = array(
				1=>"北京",
				2=>"上海",
				3=>"武汉",
				4=>"江苏",
				5=>"浙江"
			);
			$this->assign("city",$city);
			//$data->("data",$data);
			//手册的模板,变量输出,模板赋值
			$this->assign('data',$data);
			$this->display("edit");
			
		}
		
	}
	
	
	/**
	 * 实现登录
	 */
	function login(){
		if(!empty($_POST)){
			//怎么实现登录
			//取出旧的数据
			$data = $this->studentModel->where("username='".$_POST['username']."'")->find();
			if(empty($data)){
				$this->show("用户不存在","utf-8");
			}elseif($data['password']==$_POST['password']){
				$_SESSION['username']=$data['username'];
				$_SESSION['name']=$data['name'];
				/**
				 * 设置一个空的购物车
				 * 每个用户对应一个session,所以不用用户的id
				 */
				$_SESSION['cart']=array();
				$this->show("登录成功","utf-8");
				//$this->getList();
			}else{
				$this->show("密码错误","utf-8");
			}
		}else{
			$this->display("login");
		}
	}
}
?>