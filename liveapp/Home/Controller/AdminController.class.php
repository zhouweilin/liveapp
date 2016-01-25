<?php
namespace Home\Controller;
use Think\Controller;
session_start();
class AdminController extends Controller {
  public function index(){
	  if(empty($_SESSION['mid'])){
			header("Location: /?c=admin&a=login");
		}else{
		    $this->assign('mid',$_SESSION['mid']);
			$this->display();
		}
  }

	public function maker(){
	  if(empty($_SESSION['mid'])){
			header("Location: /?c=admin&a=login");
		}else{
			$this->display();
		}
	}

	public function config(){
	  if(empty($_SESSION['mid'])){
			header("Location: /?c=admin&a=login");
		}else{
			$this->display();
		}
	}

	public function preview(){
	  if(empty($_SESSION['mid'])){
			header("Location: /?c=admin&a=login");
		}else{
			$this->display();
		}
	}

	public function mobileview(){
		$User = M("info");
		$appid = I('appid','0','int');
		if(empty($appid)){
			$this->show('参数错误!'.$appid,'utf-8');
			exit();
		}
		$ti = $User->where("status>0 and appid='$appid'")->find();
		$tid = $ti['appid'];
		if(empty($tid)){
			$this->show('此微杂志不存在或已被删除!','utf-8');
			exit();
		}
		$pcurl = $ti['pcurl'];
		$wapurl = $ti['wapurl'];
		$app_con = $ti['app_con'];
		$page = $ti['page'];
		$title = $ti['title'];
		$url = $ti['url'];
		$type = $ti['type'];
    $des = $ti['des'];
    $share_img = $ti['share_img'];

		switch ($type) {
			case 1:
				$siteid = 'LCE23790156';
				$swturl = 'boai.zoossoft.com';
				break;

			case 2:
				$siteid = 'LCE66634992';
				$swturl = 'boai.zoossoft.com';
				break;

			case 3:
				$siteid = 'LCE43787019';
				$swturl = 'boai.zoossoft.com';
				break;

			case 4:
				$siteid = 'LCE74988941';
				$swturl = 'boai.zoossoft.com';
				break;

			case 6:
				$siteid = 'LJR31671888';
				$swturl = 'shangwutong.yodak.net';
				break;

			default:
				$siteid = '';
				break;
		}

		//判断不是微信浏览器中打开的时候自动跳转
		// if (is_mobile()) {
		// 	if (is_weixin()) {
				//if(empty($url)){  //正常后台制作的
					$this->assign('app_con',$app_con);
					$this->assign('page',$page);
					$this->assign('title',$title);
					$this->assign('siteid',$siteid);
					$this->assign('swturl',$swturl);
          $this->assign('type', $type);
          $this->assign('des', $des);
          $this->assign('share_img', $share_img);
          $this->assign('music_url', $url);
					$this->display();
				//}else{  //独立的微杂志
					//include(_ROOT_.$url);
					//header("Location: $url");
					//exit();
				//}
		// 	} else {
		// 		header("Location:http://".$wapurl."");
		// 	}
		// } else {
		// 	header("Location:http://".$pcurl."");
		// }
	}
	public function add(){
	    if(empty($_SESSION['mid'])){
			header("Location: /?c=admin&a=login");
		}else{
			$this->display();
		}
	}
	public function login(){
		$this->display();
	}
	public function manage(){
	    if(empty($_SESSION['mid'])){
			header("Location: /?c=admin&a=login");
		}else{
			if(($_SESSION['mid'])==1){
				$Name = M("admin");
				$this->arrData4 = $Name->field('id,username')->select();//直接赋值模版，模版就直接调用
				//echo $Name->_sql();最后一条SQL
				$this->display();
			}else{
				header("Location: /?c=admin");
			}
		}
	}

	public function modify(){
	    if(empty($_SESSION['mid'])){
			header("Location: /?c=admin&a=login");
		}else{
			$Name = M("admin");
			$id=I('id');//获取ID
			$pw = I('pw');
			$password = md5($pw);
			if (!empty($id)) {
			  	if (!empty($pw)) {
					$Name->pass=$password;
					$bool = $Name->where('id='.$id)->save();
						if($bool){
							echo "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /><script>alert('修改成功！！');</script>";
							echo "<script>location.href=\"http://liveapp2015.hithinktank.com//?c=admin&a=manage\";</script>";
						}else {
							echo "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /><script>alert('没有修改成功！！');</script>";
							$this->arrData5 = $Name->where('id='.$id)->field('id,username')->select();
							$this->display();
						}
				}else{
					$this->arrData5 = $Name->where('id='.$id)->field('id,username')->select();
			 		$this->display();
				}
			}else{
				header("Location: /?c=admin&a=login");
			}
		}
	}
}
