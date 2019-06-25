const express = require("express");
const app = express();
const fs = require("fs");

const path = "Storage/";
const PORT = 8080;


app.use(express.static("static"));


app.use("/getFolders", function(req, res){
  console.log("[#] Got request to /getFolders");

  // var list = [{name: "Documents", contents: []}, 
  //             {name: "Movies", contents: []},
  //             {name: "Pictures", contents: []}];

  var list;

  // TODO: Make a recursive fs.readdirSync
  // PS: Can make this on startup of node.js server

  // var folders = fs.readdirSync(path);
  // for(var i = 0; i < folders.length; i++){

  //   if(folders[i].isDirectory()){

  //   }

  // }
  
  res.send('{"Respoonse": "OK"}');
});

app.listen(PORT, function(){
  console.log("[#] Server listening on port " + PORT);
});