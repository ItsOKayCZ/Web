<?php

// Returns an error if somethings goes wrong
function returnError($msg){
	echo "<title>Error</title>";
	echo "Error: $msg";
	exit(1);
}

// The root directory with the main "storage"
$root = "/usr/share/apache2/Documents";

// Requesting file
$file = $_GET["file"];

// No file GET variable
if($file == ""){
	returnError("No file");
} else if(substr_count($file, "..") >= 1){
	returnError("No file");
}

// If the file starts with a "/"
if($file[0] == "/"){
	$file = $root . $file;
} else {
	$file = $root . "/" . $file;
}

// If the file exists
if(!file_exists($file)){
	returnError("Invalid file");
}


// Setting the header
$type = exec("file '$file'");
$type = array_pop(explode(":", $type));
$type = explode(",", $type);
$type = array_shift($type);
$type = substr($type, 1);

if($type == "PDF document"){

	// When PDF document
	header("Content-Type: application/pdf");

} else if($type == "ISO Media"){

	// When its a video
	
	// Opening the stream file
	$stream = fopen($file, "rb");
	if(!$stream){
		returnError("Unable to open stream file");
	}

	$size = filesize($file);
	$start = 0;		
	$end = $size - 1;


	// Setting the headers
	header("Content-Type: video/mp4");
	header("Content-Length: $size");
	header("Accept-Ranges: bytes");

	
	if(isset($_SERVER["HTTP_RANGE"])){
		$range = $_SERVER["HTTP_RANGE"];
		$range = explode("=", $range)[1];
		$range = explode("-", $range)[0];

		$start = $range;
		$length = $end - $start + 1;

		fseek($stream, $start);	
		header("HTTP/1.1 206 Partial Content");
		header("Content-Length: $length");
		header("Content-Range: bytes $start-$end/$size");
	} else {
		header("Content-Range: bytes $start-$end/$size");
	}

	// Streaming the file
	while(!feof($stream)){
		$byte = fgets($stream);
		echo $byte;
	}

	fclose($stream);
	exit(0);

} else {
	
	// When something else
	header("Content-Type: text/plain");

}

// Respond with the file
readfile($file);

?>
