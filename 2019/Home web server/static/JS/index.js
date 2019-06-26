var folderStructure;

function main(){

  var http = new XMLHttpRequest();
  var url = document.location.origin + "/getFolders";

  http.open("GET", url);
  http.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      manageRequest(JSON.parse(this.responseText));
    }
  }

  http.send();
}

function manageRequest(content){
  folderStructure = content;
  // console.log(content);

  // TODO: Append root directory
  // TODO: Display over content not only in root
  displayFolders(content);

  changeSubdirStyles();
}

function displayFolders(content){

  var list = [];

  for(var i = 0; i < content.length; i++){

    if(content[i].type == "folder"){

      var info = {
        name: content[i].name,
        dir: "root"
      };
      list.push(info);

      var folderInfo = getFolder(content[i].contents, 1);

      for(var j = 0; j < folderInfo.length; j++){
        list.push(folderInfo[j]);
      }
      
    }

  }

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

  var currentContent = [];

  for(var i = 0; i < content.length; i++){

    if(content[i].type == "folder"){

      var info = {
        name: content[i].name,
        dir: "subdir " + subdir
      };
      currentContent.push(info);

      var folderInfo = getFolder(content[i].contents, subdir + 1);
      if(folderInfo != undefined){
        for(var j = 0; j < folderInfo.length; j++){
          currentContent.push(folderInfo[j]);
        }
      }

    }

  }

  if(currentContent.length > 0){
    return currentContent;
  } else {
    return undefined;
  }
}


function changeSubdirStyles(){

  var el = document.getElementsByClassName("subdir");

  var offset = 10;

  for(var i = 0; i < el.length; i++){

    var subdir = el[i].classList[1];

    el[i].style.paddingLeft = (offset * subdir) + "px";
  }

}

function changeContent(el){

  var filesDOM = document.getElementById("files");
  var typesDOM = document.getElementById("types");

  filesDOM.innerHTML = "";
  typesDOM.innerHTML = "";

  if(el.classList[0] == "root"){

    var name = el.innerHTML;

    for(var i = 0; i < folderStructure.length; i++){

      if(folderStructure[i].name == name){

        console.log(folderStructure[i]);

        for(var j = 0; j < folderStructure[i].contents.length; j++){

          if(folderStructure[i].contents[j].type != "folder"){
            var template = document.createElement("p");
            template.innerHTML = folderStructure[i].contents[j].name;
            filesDOM.appendChild(template);

            template = document.createElement("p");
            template.innerHTML = folderStructure[i].contents[j].description;
            typesDOM.appendChild(template);
          }
          
        }

      }

    }

  }

}

function changeDisplay(el){

  changeContent(el);

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

      if(tempEl == undefined || tempEl.classList[1] <= classList || tempEl.classList == "root"){
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