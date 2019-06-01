const express = require('express')
const app = express()
const PORT = 8080

const request = require("request");
const fs = require("fs");
const path = require("path");

// The tokens for github API
app.use("/token", restricted);
function restricted(req, res){

  res.send("Restricted");
}

// When a github API is called
// https://api.github.com/repos/ItsOKayCZ/{Category}/contents/{Path}
var categories = {
  CTFs: "CTFs",
  Web: "Web",
  Python: "Python"
};
app.use("/github", githubHandler);
function githubHandler(req, res){
  var category = req.query.category;

  var githubAPI = "https://api.github.com/repos/ItsOKayCZ/" + category + "/contents";

  // When category = to the Web category
  if(category = categories.Web){

    // TODO: Web

  }

}

// All files
app.use(express.static("static"));

app.listen(PORT, function(){
  console.log("Server listening on port: " + PORT);
});
