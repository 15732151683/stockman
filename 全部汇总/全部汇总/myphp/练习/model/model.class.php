<?php
//模型基类,其他模型继承于这个模型
class Model{
	protected $db; //数据库驱动对象,即mysqldriver
	protected $table;  //模型的表名
	protected $prikey;  //模型的表中的主键
	public function __construct($db){
		$this->db = $db;
	}
	public function getAll($fields,$where,$order,$limit){
		$this->db->select($this->table,$fields,$where,$order,$limit);
	}
	public function getOne($fields,$where){
		return $this->db->selectOne($this->table,$fields,$where,"","");
		
	}
	public function getCount(){
		$result = $this->getOne("count(*)",$where);
		return $result['count(*)'];
	}
}
?>