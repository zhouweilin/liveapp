<?php
namespace Home\Controller;
use Think\Controller;
session_start();
class IndexController extends Controller {
  public function index(){
      $this->show('d','utf-8');
  }
  public function liveinto(){
		$User = M("info");
		//$callback = I('callback',''); //夸域
		// $data['create_time'] = time();
    $data['add_time'] = date('Y-m-d H:i:s');
		$mid = $_SESSION['mid'];
		$data['mid'] = $mid;   //用户ID
		$data['type'] = I('type','0');   //所属医院
		$data['name'] = I('name','');   //名称
		$data['appid'] = I('appid','');   //appid
    $data['app_con'] = I('app_con','');
		$data['page'] = I('page','0');   //页数
		$data['title'] = I('title','');   //杂志标题
		$data['des'] = I('des','');   //杂志描述
		$data['share_img'] = I('shareimg','');
    $data['ele_index'] = I('ele_index','0');
    $data['author'] = I('author','');
    $data['url'] = I('music_url', '');
    $data['music_name'] = I('music_name', '');
		$appid = $data['appid'];
		//echo $content; exit();
		if(empty($data['app_con'])){
			$js = json_encode(array('status'=>-1));
			echo $js;
			exit();
		}
		$telc = $User->where("status>0 and appid='$appid'")->getField('id');
		$id = $telc;

    //如果有数据则更新，如果没有数据，则插入
		if($id > 0){
			$result = $User->where("appid='$appid'")->save($data);
		}else{
			$result = $User->add($data);
			$id = $result;
		}
    $time = $User->where("id='$id'")->field('add_time')->find();
		if($result){
			$js = json_encode(array('status'=>1,'id'=>$id, 'time'=>$time));
			echo $js;
			exit();
		}else{
			$js = json_encode(array('status'=>-2));
			echo $js;
			exit();
		}
  }

	public function changeCover(){  //改变封面图片链接

		$User = M('info');
		$mid = $_SESSION['mid'];
		$data['share_img'] = I('shareimg','');
		$data['appid'] = I('appid','');
		$data['mid'] = $mid; //用户ID
		$appid = $data['appid'];

		if($appid){
			$result = $User -> where("appid= '$appid'") -> save($data);
		}
		if($result){
			$js = json_encode(array('status'=>1,'id'=>$id));
			echo $js;
			exit();
		}else{
			$js = json_encode(array('status'=>-2, 'appid'=>$appid, 'shareimg'=>$data['share_img'], 'id' => $id));
			echo $js;
			exit();
		}
  }

	public function changeTitle(){ //改变标题
		$User = M('info');
		$mid = $_SESSION['mid'];
		$data['title'] = I('title','');
		$data['appid'] = I('appid','');
		$data['mid'] = $mid;
		$appid = $data['appid'];

		$result = $User -> where("appid = '$appid'") -> save($data);
		if($result){
			$js = json_encode(array('status' => 1, 'msg' => $data['title']));
			echo $js;
			exit();
		}
 	}

 	public function changeDes(){//改变描述
 		$User = M('info');
 		$mid = $_SESSION['mid'];
 		$data['des'] = I('des', '');
 		$data['appid'] = I('appid', '');
 		$data['mid'] = $mid;
 		$appid = $data['appid'];
 		if($data['des']){
 			$result = $User -> where("appid = '$appid'") -> save($data);
 		}

 		if($result){
 			$js  = json_encode(array('status' => 1, 'msg' => $data['des']));
 		}
 	}

	public function getinfo(){  //获取信息
		$User = M("info");
		$id = I('id','0');
		$appid = I('appid','0');
		//$callback = I('callback',''); //夸域
		if(empty($appid) && empty($id)){
			$js = json_encode(array('status'=>-1));
			echo $js;
			exit();
		}
		if(!empty($id)){
			$wh = "status=1 AND id=$id";
		}else{
			$wh = "status=1 AND appid=$appid";
		}
		$data = $User->where("status=1 AND appid=$appid")->find();
		if(count($data)>0){
		    $js = json_encode($data);
			echo $js;
			exit();
		}else{
			$js = json_encode(array('status'=>-2));
			echo $js;
			exit();
		}
	}
	public function getlist(){  //列表
		$User = M("info");
		// $type = I('type',0);  //医院ID
		$page = I('page',1);  //第几页
		$pagesize = 50;  //每页条数
		$s = ($page-1)*$pagesize;
		$limit = $s.",".$pagesize;
		$mid = $_SESSION['mid'];  //用户ID

		$Admin = M('admin');
		$groupinfo = $Admin->field('groupid')->where("id='$mid'")->find();
		$groupid = $groupinfo['groupid'];

		//$callback = I('callback',''); //夸域
		if ($mid == 1) {
			$wh = "status>0";
			// if(empty($type)){
			// 	$wh = "status>0";
			// }else{
			// 	$wh = "status>0 and type=$type";
			// }
		} else {
			// if(empty($type)){
			// 	$wh = "status>0 and mid='$mid'";
			// }else{
			// 	$wh = "status>0 and type=$type and mid='$mid'";
			// }
			$wh = "status>0 and type=$groupid";
		}

		// $list = $User->field('id,name,cover,appid,url,type,mid')->where($wh)->order('id desc')->limit($limit)->select();
		$list = $User->field('id,title,share_img,appid,url,type,mid,des,create_time,add_time,author')->where($wh)->order('id desc')->limit($limit)->select();
		if($list){
			$results['list'] = $list;
			$results['uid'] = $mid;
			$js = json_encode($results);
			echo $js;
			exit();
		}else{
			$js = json_encode(array('status'=>-2));
			echo $js;
			exit();
		}
	}
	public function upfile(){ //上传图片
		//$app = I('app','');
		//$dir = I('dir','');
		$app = $_REQUEST['app'];
		$dir = $_REQUEST['dir'];
		$path = _ROOT_.'/Public/upload/'.$dir.'/';
		if (!is_dir($path.$app)) {
			mkdir($path.$app);
		}

		$file = $_FILES[$dir];
		$fileName = $file['name'];
		$nameArray = explode('.',$fileName);
		$extName = end($nameArray);
		$name = rand(0,500000).dechex(rand(0,10000)).".".$extName;
		$url = _ROOT_."/Public/upload/".$dir."/".$app."/".$name;
		$url2 = "/Public/upload/".$dir."/".$app."/".$name."";
		move_uploaded_file($file['tmp_name'], $url);

		echo json_encode(array('url'=>$url2, 'file'=>$file));
	}

	public function delfile(){  //删除文件
		$url = $_REQUEST['url'];
		$path = _ROOT_.'/'.$url;
    if(!substr_count($path, 'images')){
      $on = unlink($path);
    }else{
      $on = true;
    }

		if($on){
			$js = json_encode(array('status'=>1));
			echo $js;
			exit();
		}else{
			$js = json_encode(array('status'=>-1));
			echo $js;
			exit();
		}
	}

	public function loginsave(){  //登录
	  $User = M("admin");
		$user = I("post.user",''); //用户名
		$pass = I('post.pwd','');
		$pass = md5($pass);
		if(empty($user) || empty($pass)){
			echo -2;
			exit();
		}
		$ti = $User->where("status>0 and username='$user' and pass='$pass'")->find();
		$mid = $ti['id'];
		if(empty($mid)){
			echo -1;
			exit();
		}else{
			session_start();
			$_SESSION['mid']=$mid;
			echo 1;
			exit();
		}
	}
	public function user_exit(){
		unset($_SESSION['mid']);
		header("Location: /Home/admin/");
		exit();
	}
	public function getlistinfo(){  //列表
		$User = M("info");
		//$callback = I('callback',''); //夸域
		$ids = I('item',''); //ID
		$list = $User->where("id in($ids) and status=1")->order('id desc')->getField('id,name,cover,status');
		if($list){
			$out['status'] = 1;
			$out['list'] = $list;
			$js = json_encode($out);
			echo $js;
			exit();
		}else{
			$js = json_encode(array('status'=>-2));
			echo $js;
			exit();
		}
	}
	public function company(){
		$arr = array(array('id'=>1,'name'=>'远东'),
					 array('id'=>2,'name'=>'博爱'),
					 array('id'=>3,'name'=>'曙光'),
					 array('id'=>4,'name'=>'五洲'),
					 array('id'=>5,'name'=>'集团'),
					 array('id'=>6,'name'=>'上海远大'),
					 array('id'=>99,'name'=>'其它')
		);
		$js = json_encode($arr);
		echo $js;
	}
	public function getjssdk(){   //微信JS-SDK获取验证参数
		$url = I('url','');
		$signPackage=getSignPackage("wx4e6053d0f06f3333", "db03d6939a44e6a1c241155977b8cfa1",$url);
		$js = json_encode($signPackage);
		echo $js;
	}
	public function uppic(){
		if (!empty($_FILES) && $_FILES['plus']['error'] == 0) {
			$orage_file = $_FILES["plus"]["name"];
			$file_path =  _ROOT_.'/magazine/wz/shuimiantianshi/img/up/'; ;
			$file_name = time().rand(1,400) ;
			$file_suffix = end(explode(".",$orage_file));

			$new_file = $file_path.$file_name.'.'.$file_suffix;
			move_uploaded_file($_FILES["plus"]["tmp_name"], $new_file);

			$plus = 'http://liveapp2015.hithinktank.com/magazine/wz/shuimiantianshi/img/up/'.$file_name.'.'.$file_suffix;
			echo "<script>parent.stopSend('$plus')</script>";
		}
	}

  public function test(){
    $name = I('name', '');
    $tel = I('tel', '');
    $project_name = I('project_name', '');

    echo json_encode(array(
      'name' => $name, 'tel' => $tel, 'project_name' => $project_name
    ));
  }

}
