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
  var fileContent = shell.cat(pathTemp).stdout;
  var fileDesc = shell.exec("file '" + pathTemp + "'", {silent: true}).stdout.split(": ")[1];
  console.log(fileDesc);

  // if(fileDesc)
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
        description: shortData(shell.exec("file '" + (path + folders[i]) + "'", {silent: true}).split(": ")[1])
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
        description: shortData(shell.exec("file '" + (nextDir) + "'", {silent: true}).split(": ")[1])
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

// Shorts the file types
// Here are almost all of the data types stored and changed for the user to understand
// the file type
function shortData(desc){
  var list = [
    {
      // Format: MP4
      name: "MP4",
      short: function(temp){
        // String: ISO Media, MP4 v2 [ISO 14496-14]
        return "MP4 video";
      }
    },
    {
      // Format: Zip
      name: "Zip",
      short: function(temp){
        // String:  Zip archive data, at least v1.0 to extract
        return "ZIP archive";
      }
    },
    {
      // Format: PDF
      name: "PDF",
      short: function(temp){
        // String: PDF document, version 1.5
        return "PDF document";
      }
    },
    {
      // Format: PNG
      name: "PNG",
      short: function(temp){
        // String: PNG image data, 800 x 600, 8-bit/color RGBA, non-interlaced
        return "PNG image";
      }
    },
    {
      // Format: MP3
      name: "ID3",
      short: function(temp){
        // String: Audio file with ID3 version 2.4.0, contains
        return "MP3 audio";
      }
    },
    {
      // Format: JPEG
      name: "JPEG",
      short: function(temp){
        // String: JPEG image data, JFIF standard 1.01, resolution (DPI)...
        return "JPEG image";
      }
    }
  ];

  for(var i = 0; i < list.length; i++){
    if(desc.indexOf(list[i].name) != -1){
      return list[i].short(desc);
    }
  }

  return desc;
}