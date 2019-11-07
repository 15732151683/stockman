<?php
//namespace  命名空间
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {
    public function index(){
        $this->show('hello thinkphp','utf-8');
    }
    public function hello(){
    		$this->show("my php thinkphp","thf-8");
    }
}