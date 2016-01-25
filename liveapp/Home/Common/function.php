<?php

	 function files($type, $class){

		$arr = array();
		$arr = glob('./Public/images/imgList/'.$type.'/'.$class.'/*.{png,jpg,gif,mp3}', GLOB_BRACE);

    return $arr;
	}

	//添加数据库中没有的图片
	function renewData($type, $classes, $list, $table){

		if(is_array($classes)){
			foreach ($classes as $value) {

				$files = files($type, $value);

				foreach($files as $item) {
					$size = getimagesize($item);

					if(!$size){
						$size[0] = 0;
						$size[1] = 0;
					}

					$data = array(
							'img_url'      => $item,
							'img_date'     => date('Y-m-d   H:i:s', filectime($item)),
							'img_caption'  => get_basename($item),
							'img_class'    => $value,
							'img_type' 	   => $type,
							'img_size'     => filesize($item),
							'img_width'    => $size[0],
							'img_height'   => $size[1]
						);

					$index =  array_search($item, $list);

					if($index !== false){
						array_splice($list, $index, 1);
					}else{
						$table->add($data);
					}
				}
			}
		}
	}

	function addLoop($types, $list, $table) {

		if(is_array($types)){
			foreach ($types as $type => $val) {
				renewData($type, $val, $list, $table);
			}
		}
	}


	//先查询数据库，删除已经被删除的图片的记录
	function addImg($types){

		$img = M('img');
		$path = './Public/images/imgList/*/*/*.{jpg,png,gif,mp3}';
		$aImg = glob($path, GLOB_BRACE);

		$list = array();
		$res = $img->field('img_url')->select();

		foreach ($res as $url) {
			array_push($list, $url['img_url']);
		}

		//比较数据库和文件夹，返回已被删除的图片
		$diff = array_diff($list, $aImg);

		//删除多余的记录
		if(count($diff)){
			foreach ($diff as $val) {
				$data['img_url'] = $val;
				$img->where($data)->delete();
			}
		}

		//添加记录
		addLoop($types, $list, $img);
	}


function get_basename($filename){
		 return preg_replace('/^.+[\\\\\\/]/', '', $filename);
}
