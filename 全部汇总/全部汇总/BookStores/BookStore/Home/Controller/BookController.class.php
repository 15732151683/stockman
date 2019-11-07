<?php
  namespace Home\Controller;
  use Think\Controller;
  use Home\Model\BookModel;
  use \Think\Upload;

  class BookController extends Controller {
    public function _initialize() {
      $this -> BookModel = new BookModel();
    }

    public function addBook() {
      if($_POST){
        $record = array(
          'b_name' => $_POST['bookName'],
          'b_intro' => $_POST['bookIntro'],
          'b_author' => $_POST['author'],
          'b_press' => $_POST['publisher'],
          'b_PublicationDate' => $_POST['publicationDate'],
          'b_ISBN' => $_POST['ISBN'],
          'b_price' => $_POST['price']
        );
        if($_FILES){
          $upload = new Upload();
          $upload -> maxSize = 5000000;
          $upload -> rootPath = 'Public/';
          $upload -> savePath = 'upload/';
          $upload -> saveName = array('uniqid','');
          $info = $upload -> uploadOne($_FILES['file']);
          if(!$info){
            echo json_encode(array(
              'succeed' => false,
              'message' => $upload -> getError()
            ));
          }else {
            $record['b_imgPath'] = '/BookStore/Public/'.$info['savepath'].$info['savename'];
          }
        }else {
          $record['b_imgPath'] = $_POST['file'];
        }
        $result = $this -> BookModel -> add($record);
        if($result){
          echo json_encode(array(
            'succeed' => true,
            'message' => '添加成功'
          ));
        }else {
          echo json_encode(array(
            'succeed' => false,
            'message' => '添加失败'
          ));
        }

      }
    }

    public function bookDetails() {
      if(!empty($_GET[id])){
        $result = $this -> BookModel -> where("b_id='".$_GET[id]."'") -> find();
        // print_r($result);
        $this -> assign('data', $result);
        $this -> display('bookInfo');
      }else {
        $this -> redirect('Index/bookList');
      }
    }
  }