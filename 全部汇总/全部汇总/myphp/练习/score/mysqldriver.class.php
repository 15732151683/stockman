<?php
// mysql驱动类
//需要哪些方法，哪些属性
//1.连接数据库
//2.插入
//3.修改
//4.删除
//5.查询所有
//6.查询单条
class MysqlDriver
{
    private $host;
    private $user;
    private $password;
    private $db; 
    private $link;   //定义一个属性
    private $charset = "utf8";
    function __construct($host, $user, $password, $db)
    {	//将数据库连接资源赋值给对象属性link,这样在每个方法里都可以通过$this->link获取到
    	//$link只是某一个方法的内部变量 如果需要在类的所有方法中使用该变量,需要使用$this->link(类的属性)
        $this->link = mysqli_connect($host, $user, $password, $db);
        if (mysqli_connect_errno($this->link)){
            echo mysqli_connect_error($this->link);
        } else {
            mysqli_set_charset($this->link, $this->charset);
        }
    }
    /**
     * doc注释(第一行是2个* 啦)
     * @param $sql string 插入语句
     * @return $insert_id id
     */
    function insert($fields,$table)
    {//通过内部方法生成sql
    		$sql = $this->createInsertSql($fields,$table);
       mysqli_query($this->link,$sql); 
       return mysqli_insert_id($this->link);
    }
    function update($sql){
       mysqli_query($this->link,$sql); 
       return mysqli_affected_rows($this->link); 
    }
    function delete($sql){
        mysqli_query($this->link,$sql); 
       //return mysqli_affected_rows($link);
    }
    function getAll($sql){
        $result = mysqli_query($this->link,$sql);
        if ($result){
           return  mysqli_fetch_all($result,MYSQLI_ASSOC);// MYSQL_ASSOC这个返回的数组是以数据表中的字段为键的而MYSQL_NUM是以数字为键的
        }
    }
    function getOne($sql){
        $result = mysqli_query($this->link,$sql);
        if ($result){
           return  mysqli_fetch_array($result,MYSQLI_ASSOC);
        }
    }
    /**
     *生成插入语句
     * @param array $fields
     * @param string $table
     * @return string $sql
     */
    private function createInsertSql($fields,$table){
		foreach($fields as $key=>$val){
			//     拼接字段部分
			$_Fields[] = "`".$key."`";
			//拼接字段值部分
			$_Values[] = "'".$val."'";
		}
		$sql ="insert into ".$table." (".implode($_Fields,",").") values (".implode($_Values,",").")";
		return $sql;
	}

}
?>