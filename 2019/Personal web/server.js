const express = require('express')
const app = express()
const PORT = 8080

const requestPromise = require("request-promise");
const request = require("request");
const path = require("path");

// Getting the token
try{
  const fs = require("fs");
  const token = fs.readFileSync("token", "utf8").split("\n");
} catch(err){
  console.log("No token file");
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

  console.log("Got request to /github?category=" + category);

  // When category = to the Web category
  if(category == categories.Web){

    // Getting the web contents
    var promise = getContentsFromFolder(category, "");
    promise.then(function(contents){
      contents = contents.body;

      // Getting all the folders that have a year name "2016" "2018" etc.
      var temp = [];
      for(var i = 0; i < contents.length; i++){
        if(contents[i].name.substring(0, 2) == "20"){
          temp.push(contents[i].name);
        }
      }
      contents = temp;
      temp = [];

      // Number of folders in the root directory
      var numberOfFolders = contents.length;

      var done = [];
      // Getting the folders contents
      for(var i = 0; i < contents.length; i++){


        var promise = getContentsFromFolder(category, contents[i]);
        promise.then(function(projects){
          projects = projects.body;

          // Going through the projects folders
          for(var index = 0; index < projects.length; index++){

            temp.push(projects[index].name);

          }

          // If all the requests are done
          done.push("Done");
          if(done.length == numberOfFolders){
            contents = temp;

            console.log("Done processing");
            console.log("Sending contents: " + category);
            res.send(contents);
          }
        });

      }

    });

  } else {

    res.send("OK");

  }

}

// Get the contents of a folder
function getContentsFromFolder(category, path){

  var URL = "https://api.github.com/repos/ItsOKayCZ/" + category + "/contents/" + path + "?client_id=" + token[0] + "&client_secret=" + token[1];

  var options = {
    uri: URL,
    headers: {
      "User-Agent": "Personal web API"
    },
    json: true
  };

  var promise = new Promise(function(resolve, reject){

    request(options, function(error, response, body){
      resolve(response);
    });

  });

  return promise;
}

// All files
app.use(express.static("static"));

app.listen(PORT, function(){
  console.log("Server listening on port: " + PORT);
});
