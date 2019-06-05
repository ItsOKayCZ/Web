// URL: https://raw.githack.com/ItsOKayCZ/Web/master/{path}/{name}/index.html
function onClickProject(el){

  var path = el.path;
  var name = el.name;
  var diffLocation = el.diffLocation;
  var iframe = document.getElementsByClassName("content_iframe")[0];

  var url = "https://raw.githack.com/ItsOKayCZ/Web/master/";
  if(diffLocation == undefined){
    url += path + "/" + name + "/index.html";
  } else {
    url += path + "/" + name + "/" + diffLocation + "/index.html";
  }

  iframe.src = url;

}
