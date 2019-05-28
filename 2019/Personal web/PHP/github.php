<?php

// URL: https://api.github.com/repos/ItsOKayCZ/{Category}/contents/{Path}?client_id={clientID}&client_secret={clientSecret}

function main($category){

  $contents = getContents($category, "", false);
  $files = array();

  $temp = array();
  foreach($contents as $content){
    array_push($temp, getContents($category, $content, true));
  }
  $contents = $temp;


  showResult($contents);
}

function showResult($directory){

  foreach($directory as $files){
    foreach($files as $file){

      $file = explode("/", $file);


      if(sizeof($file) == 2){
        echo "<p path='" . $file[0] . "' onclick='showContent(this);'>" . $file[1] . "</p>";
      } else {
        echo "<p path='" . $file[0] . "' difIndex='" . $file[2] . "' onclick='showContent(this);'>" . $file[1] . "</p>";
      }

    }
  }

}

function getContents($category, $path, $root){

  // Setting up the URL
  $token = file_get_contents("../PHP/token");
  $token = explode("\n", $token);

  $url = "https://api.github.com/repos/ItsOKayCZ/" . $category . "/contents/" . $path . "?client_id=" . $token[0] . "&client_secret=" . $token[1];

  $ch = curl_init();

  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_USERAGENT, "Personal web");

  $directories = json_decode(curl_exec($ch), true);
  curl_close($ch);

  // Getting a json object
  // Returning folders or files

  $dontInclude = array("Webserver", "Personal web");
  $difIndex = array("Recipe Website");

  $list = array();
  foreach($directories as $directory){

    if(!$root){
      if("20" == substr($directory["name"], 0, 2)){
        array_push($list, $directory["name"]);
      }
    } else {

      $include = true;
      foreach($dontInclude as $file){
        if($directory["name"] == $file){
          $include = false;
          break;
        }
      }

      foreach($difIndex as $index){
        if($directory["name"] == $index){
          $include = false;
          array_push($list, $path . "/" . $directory["name"] . "/static");
          break;
        }
      }

      if($include){
        array_push($list, $path . "/" . $directory["name"]);
      }
    }

  }

  return $list;
}

?>
