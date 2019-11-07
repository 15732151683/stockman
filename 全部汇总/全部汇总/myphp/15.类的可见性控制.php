<?php
//可见性控制
//public, protected,private
//public 外部可见 --  外部直接访问,直接修改,默认的,类自身也能被修改,访问
//protected 除了能被类的自身(构造函数,方法)访问修改,还能被类的子类访问
//private 只能被类自身所访问
class girl{
	public $sex= "female";
	public $name;
	public $height;
	protected $age;
	private $weight = 100;
	function __construct($name,$age,$height){
		$this->name = $name."bbb";
		$this->height = $height;
		$this->age = $age+5;
		$this->weight+20;
		echo $this->sex."!";
	}
	//实例化之后先执行的是构造函数,不管类的属性,构造函数中先定义(如果类的属性没有定义过的话)赋值修改一波,然后被类中的其他函数访问修改(当然要考虑到可见性控制问题)
	function getAge(){
		return $this->age+10;
		//return $this->name."ccc";
	}
	function getWeight(){
		return $this->weight+5;
	}
}
$cuihua = new girl("翠花",10,168);
echo $cuihua->sex."?";
echo $cuihua->name."aaa";//实例化后,构造函数对public属性修改,外部echo进行了访问和修改
echo $cuihua->height+20;
//要访问和修改内部的属性,要通过类的方法来实现👇
echo $cuihua->getAge()+5;
//echo $cuihua->age+5;//protected是内部的不能被外部直接访问和修改
//echo $cuihua->weight;  //这里不能访问,是因为age是private是私有的,只能被类的内部自己访问
//要访问内部私有的属性,要通过类的方法来实现访问个修改,访问中可以修改,外部在方法之后也可以修改👇
echo $cuihua->getWeight()+25;

/**
 * 疑问???:构造函数中能对类的公共属性能访问,能进行修改,只是不会被存储,构造函数在JS中来创建一个类 从而new一个对象,在PHP中用关键字class来创建一个类 构造函数用来干嘛? 实例化么
 */
?>