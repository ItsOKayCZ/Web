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

  displayFolders(content);
}

// Displayes the folders that were called from the API
// Is called from manageRequest
function displayFolders(content){

  var parent = document.getElementById("folders");

  // Main
  var folderDIV = setDOMAttributes("div", "root");
  var folderDOM = setDOMAttributes("p", undefined, "Main", "");

  folderDIV.appendChild(folderDOM);
  parent.appendChild(folderDIV);
  
  // Other folders
  function recursionFunction(passedContent, dir){
    var content = passedContent;

    var folderDIV = setDOMAttributes("div", "subdir");

    var folderDOM;
    for(var i = 0; i < content.length; i++){

      if(content[i].type == "folder"){

        if(dir == 0){
          folderDIV = setDOMAttributes("div", "root");
        }

        folderDOM = setDOMAttributes("p", undefined, content[i].name, content[i].path);

        folderDIV.appendChild(folderDOM);

        if(content[i].contents.length != 0){
          folderDIV.appendChild(recursionFunction(content[i].contents, dir + 1));
        }

        if(dir == 0){
          parent.appendChild(folderDIV);
        }

      }

    }

    return folderDIV;

  }
  recursionFunction(content, 0);
}

// Setting the attributes for the selected DOM
function setDOMAttributes(DOM, dir, name, path){
  
  if(DOM == "div"){

    var DOM = document.createElement(DOM);
    DOM.setAttribute("class", dir);

  } else if(DOM == "p"){

    var DOM = document.createElement(DOM);
    DOM.innerHTML = name;
    DOM.path = path;
    DOM.setAttribute("onclick", "showSubdir(this)");

  }

  return DOM;
}

// Displays the contents of a folder
// Called from changeDisplay
function changeContentDIV(el){

  var fileDIV = document.getElementById("files");
  var typeDIV = document.getElementById("types");

  var path = el.path.split("/");

  var list = [];

  console.log(path);
  if(path[0] == ""){

    for(var i = 0; i < folderStructure.length; i++){

      if(folderStructure[i].type != "folder"){
        list.push({
          name: folderStructure[i].name,
          path: folderStructure[i].path,
          description: folderStructure[i].description
        });
      }

    }

  } else {

    var done = false;
    var content = folderStructure;
    var pathIndex = 0;

    while(done == false){

      for(var i = 0; i < content.length; i++){

        if(content[i].name == path[pathIndex]){

          content = content[i].contents
          pathIndex++;

          if(pathIndex == path.length){

            for(var j = 0; j < content.length; j++){
              if(content[j].type != "folder"){
                list.push({
                  name: content[j].name,
                  path: content[j].path,
                  description: content[j].description
                });
              }

            }

            done = true;
            break;
          } else {
            break;
          }

        }

      }

    }

  }


  fileDIV.innerHTML = "";
  typeDIV.innerHTML = "";

  if(list.length == 0){

    var DOM = document.createElement("p");
    DOM.innerHTML = "No files in directory";
    
    fileDIV.append(DOM);

    return;
  }

  for(var i = 0; i < list.length; i++){

    var fileDOM = document.createElement("p");
    fileDOM.innerHTML = list[i].name;
    fileDOM.path = list[i].path;
    fileDOM.setAttribute("class", "underLineText");
    fileDOM.setAttribute("onclick", "openFile(this)");

    fileDIV.appendChild(fileDOM);

    var typeDOM = document.createElement("p");
    typeDOM.innerHTML = list[i].description;

    typeDIV.appendChild(typeDOM);

  }
}

// Show the subdirectories 
function showSubdir(el){

  changeContentDIV(el);

  var directory = document.createElement("p");
  directory.innerHTML = "Directory: " + el.path;

  var directoryDOM = document.getElementById("directoryText");
  directoryDOM.innerHTML = "";
  directoryDOM.appendChild(directory);

  if(el.nextSibling == undefined){
    return;
  }
  
  el = el.nextSibling;

  if(el.className == "subdir"){

    if(el.style.display == "" || el.style.display == "none"){
      el.style.display = "flex";
    } else {
      el.style.display = "none";
    }
  }

}

// Sending a request for a file to the server
// Called by the DOM
function openFile(el){
  var width = 600;
  var height = 600;

  var name = el.innerHTML;
  var path = el.path;

  window.open(location.origin + "/getFile?file=" + path, name, "left=250,top=100,width=" + width + ",height=" + height, false);

}