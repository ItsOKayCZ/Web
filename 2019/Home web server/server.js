const express = require("express");
const app = express();
const fs = require("fs");

const shell = require("shelljs");

const path = "Storage/";
const PORT = 8080;

var list = [];

app.use(express.static("static"));

app.use("/getFolders", function(req, res){
  console.log("[#] Got request to /getFolders");

  console.log("[#] Sending list to client: " + req.ip);
  res.send(JSON.stringify(list));
});

app.listen(PORT, function(){
  console.log("[#] Server listening on port " + PORT);
});

var list;
function getFolders(){

  var folders = fs.readdirSync(path);
  for(var i = 0; i < folders.length; i++){

    var tempPath = fs.lstatSync(path + folders[i]);
    if(tempPath.isDirectory()){ // Is a folder
      
      var folder = {
        name: folders[i],
        contents: getFolderContents(path + folders[i]), 
        type: "folder"
      };

      list.push(folder);
    } else { // Is a file
      var file = {
        name: folders[i], 
        contents: fs.readFileSync(path + folders[i]), 
        type: "file",
        description: shell.exec("file " + (path + folders[i]), {silent: true}).split(":")[1]
      };
  
      list.push(file);
    }
    
  }
}
getFolders();

// Get the contents of a folder {directory}
function getFolderContents(directory){

  var contents = [];
  var folderContents = fs.readdirSync(directory);

  for(var i = 0; i < folderContents.length; i++){

    var nextDir = directory + "/" + folderContents[i];

    var tempPath = fs.lstatSync(nextDir);
    if(tempPath.isDirectory()){
      
      var folder = {
        name: folderContents[i],
        contents: getFolderContents(nextDir),
        type: "folder"
      };

      contents.push(folder);
    } else {

      var file = {
        name: folderContents[i],
        contents: fs.readFileSync(nextDir),
        type: "file",
        description: shell.exec("file " + (nextDir), {silent: true}).split(":")[1]
      };

      contents.push(file);
    }
    
  }

  return contents;
}