<?php

function getFileType($dir){
	$files = scandir($dir);
	array_shift($files); array_shift($files);

	$list = [];

	foreach($files as $file){
		$info = exec("file '$dir/$file'");
	
		$info = array_pop(explode(":", $info));

		if(preg_match("(ISO Media)", $info)){
			$info = explode(",", $info);
			$info = array_pop($info);
			$info = explode(" ", $info)[1] . " video";
		} else {
			$info = explode(",", $info);
			$info = array_shift($info);
		}

		array_push($list, $info);
	}

	return $list;
}

?>
