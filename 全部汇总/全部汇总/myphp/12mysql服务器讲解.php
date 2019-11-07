<?php
//mysql服务器: 关系型数据库
//关系型数据库的特点是每一行的字段都是相通的,每一行对应一个实体,比如用户表,每一行就对应一个唯一的用户
//mysql服务器上可以存在多个数据库,每个数据库就好像文件夹,在每个数据库里面包含很多的表,数据就是记录在表里面
//每个表拥有多个字段,每个字段就是每行实体对应的属性值,比如用户表里面,每一个行记录了每一个用户的信息,为每个用户信息包含了用户名,年龄,性别等属性,至于每张表设计为多少个字段,根据实际需要,但是不能用一个字段包含多个独立的属性
//管理数据库可以通过命令行操作,也可以借助可视化工具,比如phpmyadmin,mysqlbentch
//首先创建数据库 -- 创建表 -- 设计字段
//每一张表必须拥有一个称为主键的字段,该字段是唯一不重复的,可以通过该字段唯一地识别某行记录,比如:  user_id,
//主键一般设计为int类型,且为自增长 (AI)
//操作mysql的命令称为sql语句
//创建一个数据库
//CREATE SCHEMA `db` DEFAULT CHARACTER SET utf8 ;旧版本是 CREATE database `db` DEFAULT CHARACTER SET utf8 ;
//创建一个数据表pics(表名),pic_id(主键,唯一的),pic_name,pic_path
/*CREATE TABLE `db`.`pics` (
  `pic_id` INT NOT NULL AUTO_INCREMENT,
  `pic_name` VARCHAR(45) NULL,
  `pic_path` VARCHAR(45) NULL,
  PRIMARY KEY (`pic_id`));
*/
//库和表创建好了之后就不改动了,主要的是对数据的增删改查(CURD)
//增 - 添加数据
//删  - 
/*INSERT INTO - 表明这是一条插入语句
 * `db`.`pics`--`数据库名`.`表名`   这是插入哪一张表,其中数据库名如果是在当前数据库下操做,可以省略
 * (`pic_id`, `pic_name`, `pic_path`) ---- (字段,多个字段逗号隔开)
 * VALUES -  后面紧跟着是字段对应的值(值,   )
 * 
 * 
 */
//INSERT INTO `db`.`pics` (`pic_id`, `pic_name`, `pic_path`) VALUES ('1', 'one', 'http://img.hb.aicdn.com/504803c4ac4d0ca16ff37b39e8da2b8867118919e665e-yLRtYx_fw658，http://huaban.com/pins/319687245/');
/*修改语句
 * UPDATE --  表明这是一条修改语句
 * `db`.`pics` --  操作表名
 * SET后面是需要修改的字段及其新的值得键值对,多个字段修改,用逗号隔开
 */
UPDATE `db`.`pics` SET `pic_name`='two' WHERE `pic_id`='1';
//查询的基本结构
/*SELECT - 表明这是检索语句
 *      *表示检索需要返回所有的字段,也可以指定返回的字段,多个字段用逗号隔开,比如 select pic_name,pic_path from pics
 * */
SELECT * FROM db.pics;

//删除  --  delete
delete FROM db.pics where pic_id = 1;



//练习
//创建一个数据库,使用命令,创建一个myphoto
//创建一个表,photo_id, photo_title,photo_path,photo_hits,photo_date
//向该表插入数据,使用命令
//修改某个字段 删除, 使用命令
create schema `myphoto` default character set utf8;
create table `myphoto`.`photo`(
	`photo_id` int not null auto_increment,
	`photo_title` varchar(45) null,
	`photo_path` varchar(45) null,
	`photo_hits` varchar(45) null,
	`photo_date` varchar(45) null,
	 primary KEY (`photo_id`)	
);


//查询语句更多的格式
//where: -- 条件语句
//where 字段名(>,<,<=,>=,=,like..)值
//一个where可以拥有多个条件
//多个条件之间可以使用and与OR组合
//比如: select * from myphoto where photo_id >= 10
//比如: select * from myphoto where photo_id >= 10 and photo_id <= 100
//比如: select * from myphoto where photo_id = 10 or photo_id = 100
//limit - 限制检索的结果数量
//比如: 比如: select * from myphoto where photo_id >= 10 limit 1  (表示只需要返回一条结果
//比如: select * from myphoto where photo_id >= 10 limit 10   (表示只需要返回10)
//比如: select * from myphoto where photo_id >= 10 limit 10,10   (第一个10表示返回结果记录数中起始位置-索引位置=10,第二个表示从该位置返回10条)
//order by --排序
//asc 升序  从小到大    (ascending)
//desc 降序 从大到小排列   (descending)
//比如: select * from myphoto where photo_id >= 10 order by photo_id asc
//比如: select * from myphoto where photo_id >= 10 order by photo_id desc
?>