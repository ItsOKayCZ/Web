var rimraf = require("rimraf");
var fs = require("fs");
var path = require("path");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

global.atob = require("atob");

app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: false }));

app.use(express.static(path.join(__dirname, "static")));


// Deletes the directory (Remove recept)
app.post("/remove", function(req, res){

	var data = req.body;
	console.log("Got remove data");

	// Checking for correct data
	if(!data.Category || !data.Food){
		console.log("Invalid data");
		res.send("Invalid data");
		return;
	} else if(data.Category.length == 0 || data.Food.length == 0){
		console.log("Invalid data");
		res.send("Invalid data");
		return;
	}

	var dir = __dirname + "/static/Food/" + data.Category + "/" + data.Food;
	if(!fs.existsSync(dir)){
		console.log("Directory doesn't exist");
		res.send("Directory doesn't exist");
		return;
	}

	removeDirectory(dir);

	dir = __dirname + "/static/Food/" + data.Category;
	var removed = checkIfDirEmpty(dir);

	removeUpdate(data.Category, data.Food, removed);

	res.send("Complete");
});



function removeUpdate(cat, food, removed){

	var divTag = "</div>";

	var file = fs.readFileSync(__dirname + "/static/index.html", "utf-8");
	
	var index;
	var temp;
	if(removed){

		index = file.indexOf("<h2>" + cat + "</h2>");

		var prevStr = file.substring(0, index);
		temp = file.substring(index, file.length);

		index = index + temp.indexOf(divTag) + divTag.length;

		nextStr = file.substring(index, file.length);
		
		var str = prevStr + nextStr;
		fs.writeFile(__dirname + "/static/index.html", str, function(err){
			if(err) throw err;

			console.log("index.html changed");
		});

	} else {

		var pTag = '<p class="text" onclick="changeContent(this)">' + food + "</p>";

		index = file.indexOf(pTag);
		
		prevStr = file.substring(0, index);

		index = index + pTag.length;

		nextStr = file.substring(index, file.length);

		var str = prevStr + nextStr;
		fs.writeFile(__dirname + "/static/index.html", str, function(err){
			if(err) throw err;

			console.log("index.html changed");
		});

	}

}

function checkIfDirEmpty(dirName){

	var files = fs.readdirSync(dirName);

	if(files.length == 0){
		rimraf(dirName, function(){
			console.log("Category removed");
		});
		return true;
	}

	return false;
}

function removeDirectory(dirName){

	rimraf.sync(dirName);
	console.log("Food removed");
}



// Adds the directory (New recept)
app.post("/add", function(req, res){

	var data = req.body;
	console.log("Got add data");


	if(!checkCredentials(data.username, data.password, res)){
		return;
	}

	// Checking for correct data
	if(!data.Category || !data.Food || !data.Ingredients || !data.Steps){
		console.log("Invalid data");
		res.send("Invalid data");
		return;
	} else if(data.Category.length == 0 || data.Food.length == 0 || data.Steps.length == 0){
		console.log("Invalid data");
		res.send("Invalid data");
		return;
	}

	// Checking if the category
	var dir = __dirname + "/static/Food/" + data.Category + "/" + data.Food;
	if(!fs.existsSync(dir)){
		
		dir = __dirname + "/static/Food/" + data.Category;
		if(!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}

		dir = __dirname + "/static/Food/" + data.Category + "/" + data.Food;
		fs.mkdirSync(dir);

		// Created folder, creating .txt file
		fs.writeFile(dir + "/recipe.txt", data.Ingredients + "\n\n" + data.Steps, function(err){
			if(err) throw err;

			console.log("Saved");

		});

		// Add the image contents in a .txt file
		if(data.Image == undefined){
			data.Image = "png ";
		} else {
			if(data.ImageExt != undefined){
				data.Image = data.ImageExt + " " + data.Image;
			}
		}
		
		fs.writeFile(dir + "/image.txt", data.Image, function(err){
			if(err) throw err;

			console.log("Image saved");

		});

		addUpdate(data.Category, data.Food);

		res.send("Complete");
		return;

	} else {

		// Already exists
		console.log("Already exists");
		res.send("Already exists");
		return;

	}

});



function addUpdate(cat, food){

	var typeTag = '<div class="type">';

	var file = fs.readFileSync(__dirname + "/static/index.html", "utf-8");

	var index = file.indexOf(cat);
	if(index == -1){

		index = file.indexOf(typeTag) + typeTag.length;
		
		prevStr = file.substring(0, index);
		changeStr = "\n\n\t\t\t\t\t<h2>" + cat + "</h2>" + '\n\t\t\t\t\t<div class="foods">' + '\n\t\t\t\t\t\t<p class="text" onclick="changeContent(this)">' + food + "</p>" + "\n\t\t\t\t\t</div>";
		nextStr = file.substring(index, file.length);

		str = prevStr + changeStr + nextStr;

		fs.writeFile(__dirname + "/static/index.html", str, function(err){
			if(err) throw err;

			console.log("index.html changed");
		});

	} else if(file.indexOf(food) == -1){

		index = file.indexOf(cat);
		index += cat.length + 31;
		
		prevStr = file.substring(0, index);
		changeStr = '\n\t\t\t\t\t\t<p class="text" onclick="changeContent(this)">' + food + "</p>"
		nextStr = file.substring(index, file.length);

		str = prevStr + changeStr + nextStr;
		
		fs.writeFile(__dirname + "/static/index.html", str, function(err){
			if(err) throw err;

			console.log("index.html changed");
		});
	}

}



app.post("/getCategories", function(req, res){

	var dir = __dirname + "/static/Food/";
	cat = fs.readdirSync(dir).join(",");

	res.send(cat);

})

app.post("/getMeals", function(req, res){

	var data = req.body;

	if(!data.Category){
		console.log("Invalid data");
		res.send("Invalid data");
		return;
	} else if(data.Category.length == 0){
		console.log("Invalid data");
		res.send("Invalid data");
		return;
	}

	var dir = __dirname + "/static/Food/" + data.Category;
	if(fs.existsSync(dir)){
		var folders = fs.readdirSync(dir).join(",");
		res.send(folders);
		return;
	}

	res.send("Folder doesn't exist");

});

app.post("/getRecipe", function(req, res){

	var data = req.body;

	if(!data.Category || !data.Food){
		console.log("Invalid data");
		res.send("Invalid data");
		return;
	} else if(data.Category.length == 0 || data.Food.length == 0){
		console.log("Invalid data");
		res.send("Invalid data");
		return;
	}

	var dir = __dirname + "/static/Food/" + data.Category + "/" + data.Food;
	if(fs.existsSync(dir)){

		var file = fs.readFileSync(dir + "/recipe.txt", "utf-8");

		var ingr = file.split("</h3>")[1].split("<h3 class")[0];
		var steps = file.split("</h3>")[2]

		res.send(ingr + "," + steps);
		return;
	}

	res.send("Recipe doesn't exist.");
});

app.post("/modify", function(req, res){

	var data = req.body;

	if(!data.Category || !data.Food || !data.Ingredients || !data.Steps){
		console.log("Invalid data");
		res.send("Invalid data");
		return;
	} else if(data.Category.length == 0 || data.Food.length == 0 || data.Ingredients.length == 0 || data.Steps.length == 0){
		console.log("Invalid data");
		res.send("Invalid data");
		return;		
	}

	var dir = __dirname + "/static/Food/" + data.Category + "/" + data.Food;
	if(fs.existsSync(dir)){

		// Created folder, creating .txt file
		fs.writeFile(dir + "/recipe.txt", data.Ingredients + "\n" + data.Steps, function(err){
			if(err) throw err;

			console.log("Saved");

		});

		res.send("Complete");
		return;
	}

	res.send("Error");
});

function checkAuth(_username, _password){
	var username = "admin"; // Change this
	var password = "12345"; // Change this

	_username = atob(_username);
	_password = atob(_password);

	if(username == _username && password == _password){
		return true;
	} else {
		return false;
	}

}

// Checking the credentials
function checkCredentials(_username, _password, res){
	var err = "Invalid credentials";

	if(!_username || !_password){
		console.log(err);
		res.send(err);
		return false;
	} else if(!checkAuth(_username, _password)){
		console.log(err);
		res.send(err);
		return false;
	} else {
		return true;
	}

}

app.listen(12000);
console.log("Listening")