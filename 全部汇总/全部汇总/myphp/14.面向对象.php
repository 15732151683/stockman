<?php
//面向对象
//定义函数是为了提高代码的封装性以及重用性  ----   函数是由一组代码块组成
//面向对象,提供可用函数更高层次的封装
//类  --   包含了一组函数以及属性
//定义一个类
class Person{
	//属性
	public $name;
	public $sex;
	//构造函数  -- 在实例化类的时候,首先执行,如果构造函数有形参的话,实例化的时候一定要写上实参
	function __construct($name,$sex,$age){
		//$this表示的是这个实例
		$this->name = $name;
		$this->sex = $sex;
		$this->age = $age;
	}
	//方法
	function getSex(){
		return $this -> sex;
	}
	/**
	 *函数内部的方法与属性调用
	 * 
	 **/
	function isGirl(){
		//this表示的是实例
		if($this->getSex()=="male"){
			echo $this->name."是小鲜肉";
		}else{
			echo $this->name."是小鲜花";
		}
	}
}
//类需要实例化   -  实例化的时候需要传入相应的实参
$newPerson = new Person('zyy','male','18');
$child = new Person('heihu','female','4');
$newPerson->isGirl();
echo "<br>";
$child->isGirl();
echo "<br>";
//使用箭头指向类的属性和方法
echo $newPerson->getSex();       //通过方法来获得属性值
echo "<br>";
echo $newPerson ->sex;           //通过属性访问,先运行构造函数中的属性赋值
echo "<br>";
echo $newPerson -> name;
echo "<br>";
//练习:定义一个job类,包含薪资,工作要求,岗位名称,方法:获取岗位名称
class Job{
	//属性
//	public $xinzi;
//	public $require;
	public $gangwei;
	//构造函数
	function __construct($xinzi,$require,$gangwei){
		$this->xizni = $xinzi;
		$this->require = $require;
		$this->gangwei = $gangwei;
	}
	//方法
	function getGangwei(){
		return $this->xizni;
	}
}
$php = new Job('3K','ThinkPHP','php');
echo $php->getGangwei();  //通过方法访问数据
echo "<br>";
echo $php->gangwei;//通过构造函数传参赋值属性的方法  简单的说就是通过访问属性来访问数据


//my own mindnote:
/**
 *类包含属性和方法
 *实例们不同的属性可以放在类的属性中写死固定值,或者是大家都有的并且值一致的属性
 * 实例们大量都拥有属性但具体值不同的可以放在构造函数中,构造函数中可以定义属性和方法,属性以实参的方式传入
 * 类的方法中可以调用类的属性也可以调用构造函数的属性 实现不同的功能当然也可以传参进去啦 当然也可以调用类的方法以及构造函数的方法?
 * 实例化的时候,构造函数相对应的实参一定要传,调用某方法的时候具体再传入相对应的参数
 */

?>