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

  displayFolders(content);

  changeSubdirStyles();
}

function displayFolders(content){

  // TODO: NOT working

  var list = [];

  for(var i = 0; i < content.length; i++){

    if(content[i].type == "folder"){

      var info = {
        name: content[i].name,
        dir: "root"
      };

      list.push(info);

      if(content[i].contents.length > 0){
        var folderInfo = getFolder(content[i].contents, 1);
        for(var j = 0; j < folderInfo.length; j++){
          list.push(folderInfo);
        }
      }

    }

  }
  console.log(list);

  // DOM element
  var outputDOM = document.getElementById("folders");

  for(var i = 0; i < list.length; i++){

    var template = document.createElement("p");
    template.innerHTML = list[i].name;
    template.setAttribute("onclick", "changeDisplay(this)");
    template.className = list[i].dir;

    outputDOM.appendChild(template);

  }
}
function getFolder(content, subdir){

  var list = [];

  for(var i = 0; i < content.length; i++){

    if(content[i].type == "folder"){

      console.log("Content: " + content[i].name);
      console.log(content[i]);
      console.log(content[i].contents.length);

      var info = {
        name: content[i].name,
        dir: "subdir " + subdir
      };

      list.push(info);

      if(content[i].contents.length > 0){
        var folderInfo = getFolder(content[i].contents, subdir + 1);
        for(var j = 0; j < folderInfo.length; j++){
          list.push(folderInfo[j]);
        }
      }
    }

  }

  return list;
}


function changeSubdirStyles(){

  var el = document.getElementsByClassName("subdir");

  var offset = 10;

  for(var i = 0; i < el.length; i++){

    var subdir = el[i].classList[1];

    el[i].style.paddingLeft = (offset * subdir) + "px";
  }

}

function changeDisplay(el){

  var subdir;
  var classList = el.classList[0];
  // Change display to block
  if(classList == "root"){
    subdir = 1;

    var tempEl = el.nextElementSibling;
    var classList = "root";
    while(true){

      if(tempEl == undefined || tempEl.classList[0] == classList){
        break;
      }

      if(tempEl.classList[1] == subdir){
        if(tempEl.style.display == "" || tempEl.style.display == "none"){
          tempEl.style.display = "block";
        } else {
          tempEl.style.display = "none";
        }
      } else {
        tempEl.style.display = "none";
      }

      tempEl = tempEl.nextElementSibling;
    }

  } else if(classList == "subdir"){ // When clicked on a subdir

    subdir = parseInt(el.classList[1]) + 1;

    var tempEl = el.nextElementSibling;
    var classList = parseInt(el.classList[1]);
    while(true){

      if(tempEl == undefined || tempEl.classList[1] == classList){
        break;
      }

      if(tempEl.classList[1] == subdir){
        if(tempEl.style.display == "" || tempEl.style.display == "none"){
          tempEl.style.display = "block";
        } else {
          tempEl.style.display = "none";
        }
      } else {
        tempEl.style.display = "none";
      }

      tempEl = tempEl.nextElementSibling;
    }

  }

}