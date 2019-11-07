<?php
//上传类
// 需要哪些属性，比如允许上传类型
//需要哪些方法，比如需要检测上传类型
//构造函数需要定义哪些形参
//完成上传大小的判定
//如果发生错误,要返回错误描述:类型不对,超过大小
//完成上传后,返回文件路径
//可见性的设定,技巧:全部先设为 private 然后哪里出错改哪里,逐步开放---保持类的最小化对外开放
class Upload
{
    private $path;
    private $type;
    private $size;
    public $error;
    function __construct($path,$type, $size)
    {
        $this->path = $path;
        $this->type = $type;
        $this->size = $size;
    }
    private function checkSize($size){
    		if($this->size<$size){
    			$this->error = "文件超出允许大小";
    			return false;
    		}
    }
    //判断类型是否允许
    private function isType($type)
    {
//      if (in_array($needle, $haystack)) 
        if ($this->type == $type) {
            return true;
        } else {
        		$this->error ="只允许Image/jpeg";
            return false;
        }
    }
    //执行上传方法 $newUpload->doUpload($_FILES['pic'])
    function doUpload($file)
    {
        if ($this->isType($file['type'])) {
          if (move_uploaded_file($file['tmp_name'], $this->path.$file['name'])) {
              return $this->path.$file['name'];
          } else {
              return false;
          }
        } else {
            return false;
        }
    }
}
//实例化上传对象
//调用该对象的上传方法完成上传
//比如要上传多张图片，就可以多次调用该方法
//$newUpload = new Upload("./uploads/","image/jpeg",300000);
////上传图片pic1
////$newUpload->isType()
//$newUpload->doUpload($_FILES['pic1']);
////上传图片pic2
//$newUpload->doUpload($_FILES['pic2']);
?>