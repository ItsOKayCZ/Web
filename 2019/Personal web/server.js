const express = require('express')
const app = express()
const PORT = 8080

const request = require("request-promise");
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

  console.log("Got request to /github");
  console.log("Category: " + category);

  // When category = to the Web category
  if(category = categories.Web){

    var contents = getContentsOfFolder(category);
    contents.then(function(response){
      console.log(contents);
      console.log("YES");
    });

    // TODO: Web

  }

  res.send("OK");
}

function getContentsOfFolder(category){

  // TODO: Add token to URL
  var githubAPI = "https://api.github.com/repos/ItsOKayCZ/" + category + "/contents";

  var options = {
    uri: githubAPI,
    headers: {
      "User-Agent": "Personal web API"
    },
    json: true
  };

  var promise = new Promise(function(resolve, reject){

    request(options)
      .then(function(response){
        resolve(response);
      })
      .catch(function(err){
        console.log(err);
      });

  });

  return promise;
}

// All files
app.use(express.static("static"));

app.listen(PORT, function(){
  console.log("Server listening on port: " + PORT);
});
