// URL: https://raw.githack.com/ItsOKayCZ/Python/master/{path}/{name}/README.md
function onClickProject(el){

  var path = el.path;
  var name = el.name;
  var viewer = document.getElementsByClassName("content_viewer")[0];

  var url = "https://raw.githack.com/ItsOKayCZ/Python/master/" + path + "/" + name + "/README.md";

  var http = new XMLHttpRequest();
  http.open("GET", url);
  http.send();

  http.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      displayContents(this.responseText);
    }
  }

}

function displayContents(contents){
  contents = parseMarkdown(contents);

  var el = document.getElementsByClassName("content_viewer")[0];

  el.innerHTML = contents;

}
