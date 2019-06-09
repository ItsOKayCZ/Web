const express = require('express')
const app = express()
const PORT = 8080

const request = require("request");
const path = require("path");

// Getting the token
var token = undefined;
const fs = require("fs");
try{
  token = fs.readFileSync("token", "utf8").split("\n");
} catch(err){
  token = undefined;
  console.log("No token file");
}

// When a github API is called
// https://api.github.com/repos/ItsOKayCZ/{Category}/contents/{Path}
var categories = {
  CPlusPlus: "CPlusPlus",
  Web: "Web",
  Python: "Python",
  Repositories: "Repositories"
};
app.use("/github", githubHandler);
function githubHandler(req, res){
  var category = req.query.category;

  console.log("Got request to /github?category=" + category);

  // When category = to the Web category
  if(category == categories.Web){

    var dontAddProjects = ["Personal web", "Webserver"];
    var diffLocationOfIndex = ["Recipe Website"];
    gettingContents(res, category, dontAddProjects, diffLocationOfIndex);

  } else if(category == categories.Python){

    gettingContents(res, category);

  } else if(category == categories.CPlusPlus){

    console.log("Message sent");
    res.send('["0000/Not implemented"]');

  } else if(category == categories.Repositories){

    // Getting all the names of the directories
    var promise = getRepositories();
    promise.then(function(repos){
      repos = repos.body;

      var temp = [];
      for(var i = 0; i < repos.length; i++){
        temp.push("0000/" + repos[i].name);
      }
      repos = temp;

      console.log("Sending the repos");
      res.send(repos);

    });

  }

}

function gettingContents(res, category, dontAddProjects, diffLocationOfIndex){

  dontAddProjects = (dontAddProjects == undefined) ? [] : dontAddProjects;
  diffLocationOfIndex = (diffLocationOfIndex == undefined) ? [] : diffLocationOfIndex;

  // Getting the contents
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

          // If its a project that I dont want to include in the page
          if(dontAddProjects.contains(projects[index].name) == false){

            // A node.js project that has the index.html in the static directory
            if(diffLocationOfIndex.contains(projects[index].name) == true){
              temp.push(projects[index].path + "/static");
            } else {
              // Normal project
              temp.push(projects[index].path);
            }
          }

        }

        // If all the requests are done
        done.push("Done");
        if(done.length == numberOfFolders){
          contents = temp;

          console.log("Done processing");
          console.log("Sending contents of " + category);
          res.send(contents);
        }
      });

    }

  });

}

function getRepositories(){

  var URL = "https://api.github.com/users/ItsOKayCZ/repos";
  if(token != undefined){
    URL += "?client_id=" + token[0] + "&client_secret=" + token[1];
  }

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

// Get the contents of a folder
function getContentsFromFolder(category, path){

  var URL = "https://api.github.com/repos/ItsOKayCZ/" + category + "/contents/" + path;
  if(token != undefined){
    URL += "?client_id=" + token[0] + "&client_secret=" + token[1];
  }

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

Array.prototype.contains = function(element){
  return this.indexOf(element) != -1;
}
