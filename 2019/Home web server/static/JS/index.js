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

  var list = [];

  // The root directory of all
  list.push({
    name: "Main",
    path: "",
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

      if(folderInfo != undefined){
        for(var j = 0; j < folderInfo.length; j++){
          list.push(folderInfo[j]);
        }
      }
      
    }

  }

  // DOM element

  var parentDiv = document.getElementById("folders");
  for(var i = 0; i < list.length; i++){

    var folderDOM = document.createElement("span");

    folderDOM.innerHTML = list[i].name;
    folderDOM.path = list[i].path;
    folderDOM.setAttribute("class", list[i].dir);

    // parentDiv.appendChild(folderDOM);

  }
}

// Is a recursive function for displayFolders
// Called from displayFolders
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

// Displays the contents of a folder
// Called from changeDisplay
function changeContent(el){

  // TODO: Add the divs
  var filesDOM = document.getElementById("files");
  var typesDOM = document.getElementById("types");

  filesDOM.innerHTML = "";
  typesDOM.innerHTML = "";


  var list = [];

  // Need to discover the files in the directory
  var path = el.attributes.path.value.split("/");

  // When it is the root directory
  if(path == ""){

    for(var i = 0; i < folderStructure.length; i++){

      if(folderStructure[i].type == "file"){
      
        var info = {
          name: folderStructure[i].name,
          path: folderStructure[i].path,
          description: folderStructure[i].description
        };

        list.push(info);

      }

    }

  } else { // When it is in a subdirectory

    var done = false;

    var contentIndex = 0;
    var content = folderStructure;
    var pathIndex = 0;
    while(done == false){

      if(content[contentIndex].name == path[pathIndex]){

        if(pathIndex == path.length - 1){

          for(var i = 0; i < content[contentIndex].contents.length; i++){

            if(content[contentIndex].contents[i].type == "file"){

              var info = {
                name: content[contentIndex].contents[i].name,
                path: content[contentIndex].contents[i].path,
                description: content[contentIndex].contents[i].description
              };

              list.push(info);

            }

          }

          // Finished the loop
          done = true;

        }

        content = content[contentIndex].contents;

        pathIndex++;
        contentIndex = 0;
      } else {
        contentIndex++;
      }

    }

  }

  /*

  ///////// TODO: ?Rewrite? the displaying of the file names and descriptions

  */

  // No files in directory
  if(list.length == 0){

    var templateName = document.createElement("p");
    templateName.setAttribute("style", "text-decoration: None;");

    templateName.innerHTML = "No files in directory";

    filesDOM.appendChild(templateName);

    return;
  }

  for(var i = 0; i < list.length; i++){

    var templateName = document.createElement("p");
    var templateDesc = document.createElement("p");

    templateName.innerHTML = list[i].name;
    templateName.setAttribute("onclick", "openFile(this);");
    templateName.setAttribute("path", list[i].path);

    filesDOM.appendChild(templateName);

    templateDesc.innerHTML = list[i].description;
    templateDesc.style.height = templateName.clientHeight - 10;

    typesDOM.appendChild(templateDesc);

  }

}

// Show the subdirectories 
function showSubdir(el){

  console.log(el);

}

// Sending a request for a file to the server
// Called by the DOM
function openFile(el){
  var width = 600;
  var height = 600;

  var name = el.innerHTML;
  var path = el.attributes.path.value;

  window.open(location.origin + "/getFile?file=" + path, name, "left=250,top=100,width=" + width + ",height=" + height, false);

}