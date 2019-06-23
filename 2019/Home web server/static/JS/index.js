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
}