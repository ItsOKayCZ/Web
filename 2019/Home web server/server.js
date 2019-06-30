// Node.js modules
const express = require("express");
const app = express();
const fs = require("fs");
const shell = require("shelljs");
const resolve = require("path").resolve;

// The constant global variables
const pwd = process.cwd();
const path = "Storage/";
const PORT = 8080;

// The list of folders and files in the "database"
var list = [];


app.use(express.static("static"));

function log(msg, ip){
  console.log("{" + ip + "}\t[#] " + msg);
}

// When the client requests for the folders and files
app.use("/getFolders", function(req, res){
  log("Request to /getFolders", req.ip);
  res.send(JSON.stringify(list));
});

// When the client requests to see the contents of a file
app.use("/getFile", function(req, res){
  var file = req.query.file;
  log("Request to /getFile?file=" + file, req.ip);

  // Trying to figure out if it isn't a path traversal
  var pathTemp = resolve(path, file);
  
  if(pwd != pathTemp.substr(0, pwd.length)){
    log("Sent error", req.ip);
    res.send("<h1>Error</h1>");
    return;
  }

  // Finding the directory
  var fileContent = shell.cat(pathTemp).stdout
  var fileDesc = shell.exec("file '" + pathTemp + "'");
  console.log(fileDesc);

  res.send("OK");
});

// Running the server
app.listen(PORT, function(){
  log("Listening on port " + PORT, "127.0.0.1");
});

// Main function for searching the database
function getFolders(){

  var folders = fs.readdirSync(path);
  for(var i = 0; i < folders.length; i++){

    var tempPath = fs.lstatSync(path + folders[i]);
    if(tempPath.isDirectory()){ // Is a folder
      
      var folder = {
        name: folders[i],
        contents: getFolderContents(path + folders[i]),
        path: shortPath(path + folders[i]),
        type: "folder"
      };

      list.push(folder);
    } else { // Is a file
      var file = {
        name: folders[i],
        type: "file",
        path: shortPath(path + folders[i]),
        description: shell.exec("file " + (path + folders[i]), {silent: true}).split(":")[1]
      };
  
      list.push(file);
    }
    
  }
}
getFolders();

// Recursive function for getFolders
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
        path: shortPath(nextDir),
        type: "folder"
      };

      contents.push(folder);
    } else {

      var file = {
        name: folderContents[i],
        path: shortPath(nextDir),
        type: "file",
        description: shell.exec("file " + (nextDir), {silent: true}).split(":")[1]
      };

      contents.push(file);
    }
    
  }

  return contents;
}

// Shorten the path from:
// Storage/foo/bar
// to
// foo/bar
function shortPath(path){
  var temp = path.split("/"); temp.shift(); temp = temp.join("/");
  return temp;
}