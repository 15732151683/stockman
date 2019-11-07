<?php
namespace Home\Controller;
use Think\Controller;
use Home\Model\BookModel;
use \Think\Page;

class IndexController extends Controller {
    public function home() {
      $this -> display(index);
    }

    public function register() {
      $this -> display(register);
    }

    public function bookList() {
      $BookModel = new BookModel();
      $count = $BookModel -> count();
      $Page = new Page($count, 6);
      $show = $Page -> show();
      $result = $BookModel ->limit($Page->firstRow.','.$Page->listRows) -> select();
      foreach($result as $key => $value){
        $data[] = array(
          'id' => $value['b_id'],
          'bookName' => $value['b_name'],
          'imgUrl' => $value['b_imgpath'],
          'price' => $value['b_price'],
        );
      }
      $this -> assign('page', $show);
      $this -> assign('data', $data);
      $this -> display();
    }

    public function bookCart() {
      if(session('?user.cart')){
        $ids = [];
        foreach($_SESSION['user']['cart'] as $key => $val){
          if(!$val){
            continue;
          }
          $ids[] = $key;
        }
        if(!$ids){
          $this -> display(bookCart);
          return;
        }
        $ids = implode(", ", $ids);
        $bookModel = new \Home\Model\BookModel();
        $books = $bookModel -> where("b_id in ($ids)") -> select();
        foreach($books as $key => $value){
          $books[$key]['num'] = $_SESSION['user']['cart'][$value['b_id']];
        }
        $this -> assign("books", $books);
        $this -> display(bookCart);
      }else {
        $this -> display(bookCart);
      }

    }

    public function addBook() {
      $this -> display(addBook);
    }
}