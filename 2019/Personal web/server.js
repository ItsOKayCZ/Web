const express = require('express')
const app = express()
const PORT = 8080

const requestPromise = require("request-promise");
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

  console.log("Got request to /github");
  console.log("Category: " + category);

  // When category = to the Web category
  if(category == categories.Web){

    var promise = getContentsOfFolder(category);
    promise.then(function(contents){
      
      var temp = [];
      for(var i = 0; i < contents.length; i++){
        
        // Getting the main directories (years)
        if("20" == contents[i].name.substring(0, 2)){
          temp.push(contents[i].name); 
        }
        
      }
      contents = temp;
      temp = [];
      
      // Getting the folders from the years folders
      for(var i = 0; i < contents.length; i++){
        
        var promise = getContentsFromFolder(category, contents[i]);
        promise.then(function(folders){
          
          // For all the folders
          for(var j = 0; j < folders.length; j++){
          
            temp.push(folders[j].name);
            
          }
          
          contents = temp;
      
          
        });
         
      }
      
    });

    // TODO: Web

  }

  res.send("OK");

}

// Get the folders from years directory
function getContentsFromFolder(category, path){
  
  var githubAPI = "https://api.github.com/repos/ItsOKayCZ/" + category + "/contents/" + path;
  
  return makeRequest(request, githubAPI);
}

// Gets the years folders from the root directory
function getContentsOfFolder(category){

  // TODO: Add token to URL
  var githubAPI = "https://api.github.com/repos/ItsOKayCZ/" + category + "/contents";

  return makeRequest(requestPromise, githubAPI);
}

// Make a request
// Is isPromise = true
// Will use request-promise
function makeRequest(isPromise, URL){
  
  // TODO: Grab token from file
  
  var options = {
    uri: URL,
    headers: {
      "User-Agent": "Personal web API"
    },
    json: true
  };
  
  if(isPromise == true){
    var promise = new Promise(function(resolve, reject){

    requestPromise(options)
      .then(function(response){
        resolve(response);
      })
      .catch(function(err){
        console.log(err);
      });

    });
    
    return promise;  
  
  } else {
    
    // TODO: without promise
    
    // var promise = new Promise(function(resolve, reject){
      
    //   request(options, function(err, response, body){
    //     resolve(response);
    //   });
      
    // });
    
  }
  
}

// All files
app.use(express.static("static"));

app.listen(PORT, function(){
  console.log("Server listening on port: " + PORT);
});
