<?php
  namespace Home\Controller;
  use Think\Controller;
  use Home\Model\OrderModel;
  use Home\Model\CartModel;

  class CartController extends Controller {
    public function _initialize() {
      $this -> CartModel = new CartModel();
    }

    public function addItem() {
      if($_SESSION['user']['username']){
        if(empty($_POST)){
          echo json_encode(array(
            'succeed' => false,
            'message' => '请求方式错误'
          ));
          return ;
        }
        $id = $_POST['id'];
        $num = $_POST['num'];
        if(empty($_SESSION['user']['cart'][$id])){
          $_SESSION['user']['cart'][$id] = $num;
          $arr = array(
            'cart_uid' => $_SESSION['user']['uid'],
            'cart_b_id' => $id,
            'cart_b_num' => $num
          );
          $result = $this -> CartModel -> add($arr);
        }else {
          $_SESSION['user']['cart'][$id] += $num;
          $map['cart_uid'] = $_SESSION['user']['uid'];
          $map['cart_b_id'] = $id;
          $map['cart_status'] = 0;
          $this -> CartModel -> cart_b_num = $num;
          $result = $this -> CartModel -> where($map) -> save();
        }
        if($result){
          echo json_encode(['succeed' => true]);
        }else {
          echo json_decode(['succeed' => false]);
        }
      }else {
        echo json_encode(array(
          'succeed' => false,
          'message' => '请先登录再操作'
        ));
      }
    }

    public function delItem() {
      if(!empty($_POST)){
        $id = $_POST[id];
        $num = $_POST['num'];
        if(!empty($_SESSION['user']['cart'][$id])){
          $_SESSION['user']['cart'][$id] -= $num;
          $map['cart_uid'] = $_SESSION['user']['uid'];
          $map['cart_b_id'] = $id;
          $map['cart_status'] = 0;
          $this -> CartModel -> cart_b_num = $num;
          $result = $this -> CartModel -> where($map) -> save();
        }
        if($result){
          echo json_encode(array(
            'succeed' => true,
            'num' => $_SESSION['user']['cart'][$id]
          ));
        }else {
          echo json_encode(array(
            'succeed' => false,
            'num' => $_SESSION['user']['cart'][$id] - 1
          ));
        }
      }

    }

    public function pay() {
      if($_POST){
        $orderModel = new OrderModel();
        $order = array(
          'order_uid' => $_SESSION['user']['uid'],
          'order_b_id' => $_POST['id'],
          'order_num' => $_POST['num'],
          'order_money' => $_POST['price']*$_POST['num']
        );
        $result = $orderModel -> add($order);
        if($result){
          $map['cart_uid'] = $_SESSION['user']['uid'];
          $map['cart_b_id'] = $_POST['id'];
          $this -> CartModel -> cart_status = 1;
          $this -> CartModel -> where($map) -> save();

          $_SESSION['user']['cart'][$_POST['id']] = 0;
          echo json_encode(array(
            'succeed' => true,
            'message' => '支付成功'
          ));
        }else {
          echo json_encode(array(
            'succeed' => false,
            'message' => '支付失败'
          ));
        }
      }else {
        echo json_encode(array(
          'succeed' => false,
          'message' => '支付失败'
        ));
      }
    }
  }