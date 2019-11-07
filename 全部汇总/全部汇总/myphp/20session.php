<?php
//session  -- 只能在后台访问
//session的数据存放在服务器端
//存放的位置：session_savepath设置的就是session存放的位置（session默认以文件形式存放,将session的数组序列化成字符串）
//使用session前，需要开启session
//开启session后，会创建一个cookie，该cookie的名字为session的会话名，默认是PHPSESSION，COOKIE的值就是session的文件名，所以session是借助COOKIE来传输的
//但是session只在COOKIE里面存储了session_id，重要的信息都在服务端，所以session比cookie要安全}
//安全问题：  ---  跨站攻击，引起这个问题的原因是因为用户的数据没有经过过滤，导致脚本被写入数据库，当这些数据重新读取到浏览器的时候就会被执行，而session与COOKIE都可以通过js获取到，这样就导致用户信息泄露
//--- 黑客也可能不想盗号，只想进行某些操作，那么他也可以在数据里面写上特定的脚本，当拥有相应权限的管理员操作中执行了这些脚本，也就完成了相应的操作，比如黑客设置成为了管理员
//避免这个问题就是过滤用户的所有输入
session_start();
//session设置通过$_SESSION数组
//设置了一个名为user的session
$_SESSION['user'] = "zy";
?>