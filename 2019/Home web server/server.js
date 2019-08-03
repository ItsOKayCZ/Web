// Node.js modules
const express = require("express");
const app = express();
const fs = require("fs");
const shell = require("shelljs");
const resolve = require("path").resolve;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// The constant global variables
const pwd = process.cwd();
const path = "Storage/";
const PORT = 8080;

// Configuring express to use body-parser
app.use(bodyParser.urlencoded({ limit: "3gb", extended: true }));
app.use(bodyParser.json({ limit: "3gb", extended: true }));
app.use(cookieParser());

// Setting the router middleware
const router = express.Router();
const cookie = "defaultValue" // Change this

router.use(function(req, res, next){

  if(req.url == "/" + cookie){

    res.cookie("auth", cookie, {maxAge: 50 * 365 * 24 * 60 * 60 * 1000});
    console.log("[#] Cookie sent to " + req.ip);
    res.redirect("/");
    return;

  } else if(req.cookies.auth != cookie){
    console.log("[!!] Unauthorized access: " + req.ip);
    res.send("Unauthorized");
    return;
  }

  next();
});

app.use("/", router);

// The list of folders and files in the "database"
var list = [];

// Cookie username and password
const name = "";
const value = "";

// All of the file types
// This is the list of all the file types
var fileTypes = [
  {
    // Format: TXT
    name: "ASCII",
    contentType: "text/plain",
    short: function(){
      // String: ASCII text
      return "Text file";
    }
  },
  {
    // Format: MP3
    name: "ID3",
    contentType: "audio/mpeg",
    short: function(){
      // String: Audio file with ID3 version 2.4.0, contains
      return "MP3 audio";
    }
  },
  {
    // Format: MP4
    name: "MP4",
    contentType: "video/mp4",
    short: function(){
      // String: ISO Media, MP4 v2 [ISO 14496-14]
      return "MP4 video";
    }
  },
  {
    // Format: ZIP, Word document, Excel document
    name: "Zip archive data, at least v1.0",
    contentType: "application/zip",
    short: function(){
      // String:  Zip archive data, at least v1.0 to extract
      return "ZIP archive";
    }
  },
  {
    // Format: PDF
    name: "PDF",
    contentType: "application/pdf",
    short: function(){
      // String: PDF document, version 1.5
      return "PDF document";
    }
  },
  {
    // Format: PNG
    name: "PNG",
    contentType: "image/png",
    short: function(){
      // String: PNG image data, 800 x 600, 8-bit/color RGBA, non-interlaced
      return "PNG image";
    }
  },
  {
    // Format: JPEG
    name: "JPEG",
    contentType: "image/jpeg",
    short: function(){
      // String: JPEG image data, JFIF standard 1.01, resolution (DPI)...
      return "JPEG image";
    }
  },
  {
    // Format: xlsx
    name: /^xl\//gmi,
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    short: function(){
      return "Excel document";
    }
  },
  {
    // Format: do
    name: "Composite Document File",
    contentType: "application/msword",
    short: function(){
      // String: Composite Document File V2 Document, Little Endian, Os
      return "Word document";
    }
  },
  {
    // Format: docx
    name: /^word\//gmi,
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    short: function(){
      return "Word document";
    }
  }
];

app.use(express.static("static"));

function log(msg, ip){
  console.log("{" + ip + "}\t[#] " + msg);
}

app.use("/remove", function(req, res){
  log("Request to /remove", req.ip);

  var filePath = req.query.path;

  filePath = resolve("./", path, filePath);
  if(pwd != filePath.substr(0, pwd.length)){
    log("Sent error", req.ip);
    res.send("Error");
    return;
  }

  shell.rm("-r", filePath);

  getFolders();
  res.send(JSON.stringify(list));
});

app.use("/uploadFile", function(req, res){
  log("Request to /uploadFile", req.ip);

  var filePath = req.query.path;
  
  var fileContents;
  if(req.body.file != undefined){
    fileContents = Buffer.from(req.body.file, "base64");
  } else {
    res.send("Error");
    return;
  }
  
  filePath = resolve("./", path, filePath);1
  if(pwd != filePath.substr(0, pwd.length)){
    log("Sent error", req.ip);
    res.send("Error");
    return;
  }

  var dirPath = filePath.split("/"); 
  dirPath.pop(); 
  dirPath = dirPath.join("/");

  if(fs.existsSync(dirPath) == false){
    shell.mkdir("-p", dirPath);
  }

  fs.writeFile(filePath, fileContents, function(err){
    if(err) throw err;

    getFolders();
    console.log("[#] Updated the folder structure");

    res.send(JSON.stringify(list));
  });
});

// When the client requests for the folders and files
app.use("/getFolders", function(req, res){
  log("Request to /getFolders", req.ip);

  res.send(JSON.stringify(list));
});

// When the client requests to see the contents of a file
app.use("/getFile", function(req, res){

  var file = req.query.file;
  log("Request to /getFile?file=" + file, req.ip);

  var pathTemp = resolve(path, file);

  // Trying to figure out if it isn't a path traversal
  if(pwd != pathTemp.substr(0, pwd.length)){
    log("Sent error", req.ip);
    res.send("<h1>Error</h1>");
    return;
  }

  // Setting Content-Type
  var fileType = shortData(pathTemp);
  res.setHeader("Content-Type", getContentType(fileType));

  res.sendFile(pathTemp);
});

// Running the server
app.listen(PORT, function(){

  log("Cookie has been set to " + cookie, "127.0.0.1");

  log("Listening on port " + PORT, "127.0.0.1");
});

// Main function for searching the database
function getFolders(){

  list = [];

  if(!fs.existsSync(path)){
    fs.mkdirSync(path);
  }

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
        description: shortData(path + folders[i])
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
        description: shortData(nextDir)
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
function shortData(path){

  var file = shell.exec("file '" + path + "'", {silent: true}).split(": ")[1];
  var strings = shell.exec("strings '" + path + "'", {silent: true}).stdout;
  
  for(var i = 0; i < fileTypes.length; i++){
  
    if(file.search(fileTypes[i].name) != -1){
      return fileTypes[i].short();
    } else 
    if(strings.search(fileTypes[i].name) != -1){
      return fileTypes[i].short();
    }
  }


  return file;
}

// Sets the Content-Type in response header
function getContentType(fileType){

  for(var i = 0; i < fileTypes.length; i++){

    if(fileType == fileTypes[i].short()){
      return fileTypes[i].contentType;
    }
  }

  return "application/octet-stream" // text/plain
}
