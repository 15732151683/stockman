<?php
//封装与集成
//如果子类定义了构造函数,那么父类的构造函数就不会被执行,所以一般子类不定义构造函数,那如果子类有需要初始化的方法该怎么办,子类可以重写父类的方法
class Person{
	public $name;
	public $age;
	function getName(){
		return $this->name;
	}
	function getAge(){
		return $this->age;
	}
	function getSex(){
		return $this->sex;
	}
	function __construct($name,$age){
		$this->name = $name;
		$this->age = $age;
		echo "man class";
	}
	function init(){
		echo "parent";
	}
}
//定义一个男人类同时继承了父类
class Man extends Person{
	protected $sex= "男";
	//在子类里面重写父类的方法
	function init(){
		echo "child man";
	} 
}
class Woman extends Person{
	protected $sex = "女";
}
$newMan = new Man("zhangsan",38);//先运行构造函数呢 所以 会 echo "man class";
echo $newMan->getName();
$newWoman = new Woman("cuihua",18);
echo $newMan ->getSex()."?!";
echo $newWoman ->getSex();
echo $newMan ->init();
echo $newWoman ->init();



/**
 * 继承就是父类复制粘贴一份到子类,当然子类需要重置方法,那就把父类的方法重写覆盖就可以了
 */
?>