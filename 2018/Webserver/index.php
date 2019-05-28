<?php

session_start();

$root = "/usr/share/apache2/Documents";

if(!isset($_SESSION["currentDir"])){
	$_SESSION["currentDir"] = $root;
}

function setCurrentDir($newDir){

	if($newDir == "New"){

		// When nothing entered
		$_SESSION["currentDir"] = $root;

	} else if($newDir == ".."){
		
		// When going back
		$temp = explode("/", $_SESSION["currentDir"]);
	
		array_pop($temp);

		$_SESSION["currentDir"] = join("/", $temp);

	} else {

		// When going into a new directory
		$_SESSION["currentDir"] .= "/" . $newDir;

	}

	if(substr_count($_SESSION["currentDir"], "..") >= 1){
		$_SESSION["currentDir"] = $root;
	}

	if(!preg_match("(/usr/share/apache2/Documents)", $_SESSION["currentDir"])){
		$_SESSION["currentDir"] = $root;
	}	
}

?>
<html>
	
	<head>
		<title>Home server</title>
		<link href="CSS/style.css" rel="stylesheet">
	</head>

	<body>

	<div id="header">

		<h1 class="headerText">Directories</h1>

	</div>


	<div id="content">

		<div id="files">	

			<?php include "PHP/scanDirectory.php"; ?>	

		</div>
	
	</div>

	</body>
</html>
