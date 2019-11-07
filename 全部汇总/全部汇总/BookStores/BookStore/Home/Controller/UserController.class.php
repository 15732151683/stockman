<?php
  namespace Home\Controller;
  use Think\Controller;
  use Home\Model\UserModel;
  use Home\Model\CartModel;

  class UserController extends Controller {
    public function _initialize() {
      $this -> UserModel = new UserModel();
    }

    private function emptyData() {
      if(empty($_POST['username'])||empty($_POST['password'])){
        echo json_encode(['succeed' => false, 'message' => '用户名和密码不能为空']);
        return false;
      }else {
        return true;
      }
    }

    public function register() {
      if(!empty($_POST)){
        if(!($this -> emptyData())){
          return ;
        }
        $result = $this -> UserModel -> where("u_name='".$_POST['username']."'") -> find();
        if($result){
          echo json_encode(['succeed' => false, 'message' => '用户名已存在']);
          return ;
        }else {
          $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
          $result = $this -> UserModel -> add(['u_name' => $_POST['username'], 'u_password' => $password]);
          if($result){
            echo json_encode(['succeed' => true, 'message' => '插入成功']);
          }else {
            echo json_encode(['succeed' => true, 'message' => '我也不知道是啥错']);
          }
        }
      }else {
        $this -> display('Index:register');
      }
    }

    public function login() {
      if(!empty($_POST)){
        if(!($this -> emptyData())){
          return ;
        }
        $result = $this -> UserModel -> where("u_name='".$_POST['username']."'") -> find();
        if(!$result){
          echo json_encode(['succeed' => false, 'message' => '用户不存在']);
          return ;
        }else {
          if(password_verify($_POST['password'], $result['u_password'])){
            $_SESSION['user']['username'] = $_POST['username'];
            $_SESSION['user']['uid'] = $result['u_id'];
            $CartModel = new CartModel();
            $map['cart_uid'] = $result['u_id'];
            $map['cart_status'] = 0;
            $result = $CartModel -> where($map) -> select();
            if($result){
              foreach($result as $key => $val){
                $_SESSION['user']['cart'][$val['cart_b_id']] = $val['cart_b_num'];
              }
            }
            echo json_encode(['succeed' => true, 'message' => '登录成功', 'info' => 'ryuukoun']);
          }else {
            echo json_encode(['succeed' => false, 'message' => '登录失败']);
          }
        }
      }else {
        $this -> display('Index:index');
      }
    }
  }