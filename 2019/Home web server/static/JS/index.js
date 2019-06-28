var folderStructure;


// The main function
// main is called onload of the body DOM
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

// Manages request from the server API and displays it and sets the styles
// Is called from main
function manageRequest(content){
  folderStructure = content;

  // TODO: Display over content not only in root
  // TODO: Root directory not showing files
  displayFolders(content);

  changeSubdirStyles();
}

// TODO: Write documentation to functions
function displayFolders(content){

  var list = [];

  // The root directory of all
  list.push({
    name: "Main",
    dir: "root"
  });

  for(var i = 0; i < content.length; i++){

    if(content[i].type == "folder"){

      var info = {
        name: content[i].name,
        path: content[i].path,
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
    template.setAttribute("path", list[i].path);
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
        path: content[i].path,
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

  var list = [];

  console.log(folderStructure);

  var filesDOM = document.getElementById("files");
  var typesDOM = document.getElementById("types");

  filesDOM.innerHTML = "";
  typesDOM.innerHTML = "";



  // No files in directory
  if(list.length == 0){

    var templateName = document.createElement("p");

    templateName.innerHTML = "No files in directory";

    filesDOM.appendChild(templateName);

    return;
  }

  for(var i = 0; i < list.length; i++){

    var templateName = document.createElement("p");
    var templateDesc = document.createElement("p");

    templateName.innerHTML = list[i].name;
    templateDesc.innerHTML = list[i].description;

    filesDOM.appendChild(templateName);
    typesDOM.appendChild(templateDesc);

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