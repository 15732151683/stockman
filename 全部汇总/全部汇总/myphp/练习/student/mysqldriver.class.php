<?php
 
    class MysqlDriver
    {
        protected $db;
        public function __construct($host,$user, $password,$dbname)
        {
            //实例化一个mysqli对象
            //
            $this->db = new mysqli($host, $user, $password, $dbname);
            $this->db->set_charset("utf8");
        }
        //创建查询语句
        /**
     * 查询语句
     * @param $table string 
     * @param $fields string (*|多字段,分隔
     * )
     * @param $where string
     * @param $groupField=null 分组字段
     * @param $order array  ([字段，排序方式])
     * @param $limit  string|array 查询limit
     */
     private function createSelectSql($table, $fields, $where, $order, $limit, $groupField=null)
     {
         $select = "select $fields from `$table` ";
         //判定有没有传入条件
         if (!empty($where)) {
             $select .= " where $where ";
         }
         //判定排序要求
         if (!empty($order)) {
             $select .= " order by {$order[0]} {$order[1]} ";
         }
         //判定是否需要分组
         if (!empty($groupField)) {
             $select .= " group by $groupField ";
         }
         
         //limit判定是否是一个数组  数组,一个值为$start 还有一个为条数$pagesize
         if (is_array($limit)) {
             $select .= "limit {$limit[0]}, {$limit[1]}";
         } else {
             if (!empty($limit)) {
                 $select .= "limit $limit";
             }
         }
         return $select;
     }
        //创建插入语句
    private function createInsertSql($table, $fields)
    {
        //insert into 表名 set key=value
        $insert = "insert into ";
        $insert .= $table;
        $insert .= " set ";
        foreach ($fields as $key=>$val) {
            $insert .= "`$key`='".addslashes($val)."',";
//          addslashes 对单引号，双引号加转义符
//          htmlspecialchars($string)
        }
        $insert = rtrim($insert, ",");
        return $insert;
    }
        
        //创建修改语句
        /**
     *update
     *@param $table string 修改的表名
     *@param $fields array 修改的字段键值对
     *@param $where string 条件 
     */
 private function createUpdateSql($table, $fields, $where)
    {
        $update = "update ";
        $update .= " $table ";
        $update .= " set ";
        foreach ($fields as $key=>$val) {
            $update .= "`$key`='".$val."',";
        }
        $update = rtrim($update, ",");
        $update .= " where ".$where;
        return $update;
    }
    
        //创建删除语句
        /**
     * 删除
     * @param $table  string 表名
     * @param $where  string 删除条件
     * 
     */
  private function createDeleteSql($table, $where)
    {
        $delete = "delete from $table where $where";
        return $delete;
    }
    
        //增操作
        //查操作
    public function select($table, $fields, $where, $order, $limit)
    {
        $sql = $this->createSelectSql($table, $fields, $where, $order, $limit);
        $result =$this->db->query($sql);
        $datas = $result->fetch_all(MYSQLI_ASSOC);
        return $datas;
    }
    //为什么不直接传$sql,而是传参数
    //提高类的封装性(每一次都在业务逻辑里去拼接sql语句,容易出错,代码不够简洁)
    //函数与类的设计要符合单一原则,函数或者类不要实现过多的功能,提高代码的可维护性
    public function selectOne($table, $fields, $where, $order, $limit)
    {
    		//生成一个sql语句
        $sql = $this->createSelectSql($table, $fields, $where, $order, $limit);
        //执行
        $result =$this->db->query($sql);
        //返回结果
        $datas = $result->fetch_array(MYSQLI_ASSOC);
        return $datas;
    }
       
        //修改操作
    public function update($table,  $array, $where)
        {
            $sql = $this->createUpdateSql($table,  $array, $where);
            $this->db->query($sql);
            //希望知道成功修改了多少条
            return $this->db->affected_rows;
        }
    
        //删除操作
        function delete($table, $where)
        {
          $sql = $this->createDeleteSql($table, $where);
          $this->db->query($sql);
          return $this->db->affected_rows;
      }
        
    public function insert($table, $fields)
            {
               
                $sql = $this->createInsertSql($table, $fields);
//             
                $result = $this->db->query($sql);
                //插入这一条的id是什么
                //返回最后一次插入数据表的id
                return $this->db->insert_id;
              
            }
       
    }
