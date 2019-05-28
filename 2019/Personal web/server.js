const express = require('express')
const app = express()
const PORT = 8080

const path = require("path");

// The tokens for github API
app.use("/token", restricted);
function restricted(req, res){

  // if(req.ip == "::ffff:127.0.0.1" && (req.hostname == "localhost" || req.hostname == "127.0.0.1")){
  //   res.set("Content-Type", "text/plain");
  //   res.sendFile(__dirname + "/static/token");
  // } else {
  //   res.send("Restricted");
  // }

  res.send("Restricted");
}

// When a github API is called
app.use("/github", githubHandler);
function githubHandler(req, res){
  var category = req.query.category;

  

  res.send("OK");
}

// All files
app.use(express.static("static"));

app.listen(PORT, function(){
  console.log("Server listening on port: " + PORT);
});
