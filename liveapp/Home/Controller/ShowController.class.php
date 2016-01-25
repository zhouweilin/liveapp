<?php
namespace Home\Controller;
use Think\Controller;
class ShowController extends Controller {
  public function index(){
  		$User = M("info");
  		$id = I('id','0','int');
  		/*
  		$b = I('b','0','int');
  		if($b == 1){
  			$url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
  			//$jssdk = new \Org\Util\Jssdk("wx4e6053d0f06f3333", "db03d6939a44e6a1c241155977b8cfa1",$ticket,$token);
  			$signPackage=getSignPackage("wx4e6053d0f06f3333", "db03d6939a44e6a1c241155977b8cfa1",$url);
  			print_r($signPackage);
  			exit();
  		}
  		*/
  		if(empty($id)){
  			$this->show('参数错误!','utf-8');
  			exit();
  		}
  		$ti = $User->where("status>0 and id='$id'")->find();
  		$tid = $ti['id'];
  		if(empty($tid)){
  			$this->show('此微杂志不存在或已被删除!','utf-8');
  			exit();
  		}
  		$pcurl = $ti['pcurl'];
  		$wapurl = $ti['wapurl'];
  		$content = $ti['content'];
  		$page = $ti['page'];
  		$title = $ti['title'];
  		$url = $ti['url'];
  		$type = $ti['type'];

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
        			// if (is_weixin()) {
            				if(empty($url)){  //正常后台制作的
            					$this->assign('content',$content);
            					$this->assign('page',$page);
            					$this->assign('title',$title);
            					$this->assign('siteid',$siteid);
            					$this->assign('swturl',$swturl);
            					$this->display();
            				}else{  //独立的微杂志
            					include(_ROOT_.$url);
            					//header("Location: $url");
            					exit();
            				}
        			// } else {
        			// 	header("Location:http://".$wapurl."");
        			// }
    		// } else {
    		// 	header("Location:http://".$pcurl."");
    		// }
  }

	public function showlist(){  //列表页
		$User = M("info");
		$id = I('id','0','int');  //1:远东  2：博爱 3：曙光  4：五洲
		if(empty($id)){
			$this->show('参数错误!','utf-8');
			exit();
		}
		if($id == 1){
			$topimg = '<a href="http://wap.woman91.com/"><img src="/Public/images/list/ydLogo.jpg" alt=""></a>';
			$title = '远东医院微杂志';
			$keywords = '';
			$des = '';
		}elseif($id == 2){
			$topimg = '<a href="http://m.boai.com/"><img src="/Public/images/list/baLogo.jpg" alt=""></a>';
			$title = '博爱医院微杂志';
			$keywords = '';
			$des = '';
		}elseif($id == 3){
			$topimg = '<a href="http://m.sg91.net/"><img src="/Public/images/list/sgLogo.jpg" alt=""></a>';
			$title = '曙光医院微杂志';
			$keywords = '';
			$des = '';
		}elseif($id == 4){
			$topimg = '<a href="http://wap.wz16.net/"><img src="/Public/images/list/wzLogo.jpg" alt=""></a>';
			$title = '五洲医院微杂志';
			$keywords = '';
			$des = '';
		}else{
			$this->show('参数错误!','utf-8');
			exit();
		}
		$wh = "status>0 and type=$id";
		$limit = '0,10';
		$list = $User->field('id,name,cover,des,share_img')->where($wh)->order('id desc')->limit($limit)->select();
		$content = '';
		foreach($list as $field){
			if(empty($field['share_img'])){
				$field['share_img'] = $field['cover'];
			}
			$field['des'] = mb_substr($field['des'],0,30,'UTF-8');
			$field['name'] = mb_substr($field['name'],0,17,'UTF-8');
			$content .= '<section >
				<div class="mod">
					<dl>
						<dt>
							<a href="/?c=show&id='.$field['id'].'">
								<img src="'.$field['share_img'].'" alt="">
							</a>
						</dt>
						<dd>
							<h4> <a href="/?c=show&id='.$field['id'].'">'.$field['name'].'</a> </h4>
							<p><a href="/?c=show&id='.$field['id'].'">'.$field['des'].'......</a></p>
						</dd>
					</dl>
				</div>
			</section>';
		}

		$this->assign('content',$content);
		$this->assign('title',$title);
		$this->assign('keywords',$keywords);
		$this->assign('des',$des);
		$this->assign('id',$id);
		$this->assign('topimg',$topimg);
		$this->display();
	}

	public function addlist(){
		$User = M("info");
		$id = I('id','0','int');  //1:远东  2：博爱 3：曙光  4：五洲
		$p = I('p','1','int'); //页数
		if(empty($id)){
			echo '';
			exit();
		}
		$pagesize = 10;  //每页条数
		$s = ($p-1)*$pagesize;
		$limit = $s.",".$pagesize;
		$wh = "status>0 and type=$id";
		$list = $User->field('id,name,cover,des,share_img')->where($wh)->order('id desc')->limit($limit)->select();
		$content = '';
		foreach($list as $field){
			if(empty($field['share_img'])){
				$field['share_img'] = $field['cover'];
			}
			$field['des'] = mb_substr($field['des'],0,30,'UTF-8');
			$field['name'] = mb_substr($field['name'],0,17,'UTF-8');
			$content .= '<section >
				<div class="mod">
					<dl>
						<dt>
							<a href="/?c=show&id='.$field['id'].'">
								<img src="'.$field['share_img'].'" alt="">
							</a>
						</dt>
						<dd>
							<h4> <a href="/?c=show&id='.$field['id'].'">'.$field['name'].'</a> </h4>
							<p><a href="/?c=show&id='.$field['id'].'">'.$field['des'].'......</a></p>
						</dd>
					</dl>
				</div>
			</section>';
		}
		echo $content;
		exit();
	}

  public function updateImg(){
    $img = M('img');

    $types = array(
      'pageBg' => array('festival','scenery'),
      'images' => array('festival','scenery'),
      'music'  => array('exciting', 'popular', 'warm')
    );
    addImg($types);

    $list = $img->where('id>0')->field('img_url, img_size, img_type')->select();
    $this->assign('list', $list);
    $this->display();
  }

  public function getImgs(){
    $img = M('img');

    $type = I('type', '');
    $data['img_type'] = $type;
    if(!empty($type)){
      $result = $img->field('img_url, img_class, img_type, img_caption')->where($data)->select();
      echo json_encode($result);
    }
  }

  public function showmag(){
    $type = I('type','');
    $url = '';

    if(empty($type)){
      $this->show('参数错误', 'utf-8');
    }else{

      switch ($type) {
        case 1:
            //美容游戏 
            $url = '/magazine/boai/beauty_ten/index.html';
          break;
        case 2:
            //相片上传
            $url = '/magazine/boai/show_game/index.html';
        break;

        case 3:
        	$url = '/magazine/sg/activity/runer/runer.html';
        	break;
      }

      include(_ROOT_.$url);
    }
  }



}
