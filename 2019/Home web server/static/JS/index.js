function main(path){

  if(path == undefined){
    path = "";
  }

  var http = new XMLHttpRequest();
  var url = document.location.origin + "/getFolders?path=" + path;

  http.open("GET", url);
  http.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      manageRequest(JSON.parse(this.responseText));
    }
  }

  http.send();
}

function manageRequest(content){
  // TODO: Manager request from api and display it

  console.log(content);
  changeSubdirStyles();
}

function changeSubdirStyles(){

  var el = document.getElementsByClassName("subdir");

  var offset = 10;

  for(var i = 0; i < el.length; i++){

    var subdir = el[i].classList[1];

    el[i].style.paddingLeft = (offset * subdir) + "px";
  }

}