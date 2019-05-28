<?php

include "getFileType.php";

$root = "/usr/share/apache2/Documents";

$add = $_GET["fileName"];

if($add != ""){

	$dir = $root . "/" . $add;

	setCurrentDir($add);

	if($_SESSION["currentDir"] != ""){
		$files = scandir($_SESSION["currentDir"]);
	} else {
		$files = scandir($root);
		setCurrentDir("New");
	}

	if($files == ""){
		$files = scandir($root);
		setCurrentDir("New");
	}

} else {
	setCurrentDir("New");

	$files = scandir($root);
}

// echo "Directory: " . $_SESSION["currentDir"] . "<br><br>";

if($_SESSION["currentDir"] == ""){
	$list = getFileType($root);
} else {
	$list = getFileType($_SESSION["currentDir"]);
}

array_shift($files);
array_unshift($list, "Go back");

$i = 0;

foreach($files as $file){

	if($list[$i] == " directory"){
		$tag = "<div class='divFilesNames'><a href='?fileName=$file'><spam class='filesNames'>$file</spam></a><spam class='tab textBold'>" . $list[$i] . "</spam></div>";
	} else if($i == 0){
		$tag = "<div class='divFilesNames'><a href='?fileName=$file'><spam class='filesNames'>$file</spam></a><spam class='tab'>" . $list[$i] . "</spam></div>";
	} else {
		$tmp = substr($_SESSION["currentDir"], strlen($root) + 1);

		$tag = "<div class='divFilesNames'><spam class='filesNames' onclick='window.open(\"getFile.php?file=$tmp/$file\", \"$file\", \"width=800, height=800\");'>$file</spam><spam class='tab'>" . $list[$i] . "</spam></div>";
	}
	echo "$tag";
	$i++;
}

?>
