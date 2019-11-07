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
    private $link;
    private $charset = "utf8";
    function __construct($host, $user, $password, $db)
    {
        $this->link = mysqli_connect($host, $user, $password, $db);
        if (mysqli_connect_errno($this->link)){
            echo mysqli_connect_error($this->link);
        } else {
            mysqli_set_charset($this->link, $this->charset);
        }
    }
    /**
     * @param $sql string 插入语句
     * @return $insert_id id
     */
    function insert($sql)
    {
       mysqli_query($this->link,$sql); 
       return mysqli_insert_id($this->link);
    }
    function update($sql){
       mysqli_query($this->link,$sql); 
       return mysqli_affected_rows($this->link); 
    }
    function delete($sql){
        mysqli_query($this->link,$sql); 
       return mysqli_affected_rows($link);
    }
    function getAll($sql){
        $result = mysqli_query($this->link,$sql);
        if ($result){
           return  mysqli_fetch_all($result);
        }
    }
    function getOne($sql){
        $result = mysqli_query($this->link,$sql);
        if ($result){
           return  mysqli_fetch_array($result);
        }
        
    }

}
?>