const express = require("express");
const app = express();
const PORT = 8080;

app.use(express.static("static"));

app.use("/getFolders", function(req, res){

  // var path = req.query.path;

  // console.log("Path: " + path);

  console.log("[#] Got request to /getFolders");


  res.send('{"Message": "Testing"}');

});

app.listen(PORT, function(){
  console.log("[#] Server listening on port " + PORT);
});