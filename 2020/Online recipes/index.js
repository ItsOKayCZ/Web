/*
 * The main file of the server
 */

/**
 * All of the used modules
 */
const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const { Client } = require('pg');
const format = require('pg-format');
require('dotenv').config({ path: './cred' });

// The port of the server
const PORT = 8080;

// Setting DB client
const client = new Client({
	user: process.env.DBusername,
	host: 'localhost',
	database: process.env.DBdatabase,
	password: process.env.DBpassword,
	port: 5432
})
client.connect();

// Setting the render engine
app.set('view engine', 'ejs');

/**
 * CUSTOM MIDDLEWARE
 */

// Settings
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.use(express.static('static'));

/**
 * ##############
 * API 
 * ############## 
 */
/**
 * Login
 */
app.post('/login', (req, res) => {
	var {
		username,
		password
	} = req.body;

	if(username == process.env.username && password == process.env.password){
		res.cookie('id', process.env.authCookie, { maxAge: 9000000, httpOnly: true, sameSite: 'strict' });
		res.sendStatus(200);
		return;
	}

	res.sendStatus(401);
});
/** 
 * Authentication of the user 
 */ 
app.use('/API/*', (req, res, next) => {
	if(req.cookies.id == undefined || req.cookies.id != process.env.authCookie){
		res.sendStatus(401);
		return;
	}

	next();
})

/**
 * Add category
 *
 * @param	categoryName	-> The name of the category to be added
 */
app.post('/API/addCategory', (req, res) => {
	var categoryName = req.body.categoryName;

	console.log(`# Adding category name ${categoryName}.`);
	
	var queryString = 'INSERT INTO categories VALUES ($1)';

	client.query(queryString, [categoryName], (err, dbRes) => {
		if(err){
			res.sendStatus(409);
			return;
		}

		res.json({ code: 200, message: 'Category was successfully added' });
	})
})
/**
 * Gets all of the categories from the DB
 */
app.post('/API/getCategories', (req, res) => {
	var queryString = 'SELECT * FROM categories';
	client.query(queryString, (err, dbRes) => {
		if(err){
			console.error(err);
			return;
		}

		var categoryNames = [];
		for(var i = 0; i < dbRes.rows.length; i++){
			categoryNames.push(dbRes.rows[i].categoryname);
		}

		res.json(categoryNames);
	})
})
/**
 * Remove categories
 *
 * @param	categoryNames	-> The array of the names to be removed
 */
app.post('/API/removeCategories', (req, res) => {
	var categoryNames = req.body.categoryNames;

	var queryString = 'DELETE FROM categories WHERE categoryname IN (';
	for(var i = 0; i < categoryNames.length; i++){
		queryString += `$${i + 1}, `;
	}
	queryString = queryString.substring(0, queryString.length - 2) + ')';

	client.query(queryString, categoryNames, (err, dbRes) => {
		if(err){
			console.error(err);
			res.sendStatus(500);
			return;
		}

		res.json({ message: 'Categories where successfully removed', code: 200 });
	})

})

/**
 * Gets the recipes of that category
 *
 * @param	categoryName	-> The name of the category
 * @param	order			-> The order of the names of the recipes to be sorted by
 */
app.post('/API/getRecipes', (req, res) => {
	var {
		categoryName: category,
		order
	} = req.body;

	console.log(`# Getting recipes of category ${category}`);

	var queryString = 'SELECT * FROM recipes WHERE category=$1 ORDER BY name ';
	if(order == 'ASC')
		queryString += 'ASC';
	else
		queryString += 'DESC';

	client.query(queryString, [category], (err, dbRes) => {
		if(err){
			console.log(err);
			res.sendStatus(500);
			return;
		}

		res.json({ data: dbRes.rows, code: 200 });
	})
})

/**
 * Renders the info about the recipe
 *
 * Query:
 * @param	id	-> The id of the recipe
 */
app.post('/API/getRecipe', (req, res) => {
	var { id } = req.body;

	var queryString = 'SELECT * FROM recipes WHERE id=$1';
	client.query(queryString, [id], (err, dbRes) => {
		if(err){
			console.log(err);
			res.sendStatus(500);
			return;
		}

		res.json({ data: dbRes.rows[0], code: 200 });
	})
})

/**
 * Add recipe to category
 *
 * @param	category	-> The category, in which the recipe will be added in
 * @param	name		-> The name of the recipe
 * @param	image		-> The name and the data of the image
 * @param	ingredients	-> The ingredientName and amount of the recipe
 * @param	steps		-> The steps
 */
app.post('/API/addRecipe', (req, res) => {
	var {
		category,
		name,
		image,
		ingredients,
		steps
	} = req.body;

	let contents = Buffer.from(image.data.split(',')[1], 'base64');
	fs.writeFile(`static/recipeImages/${image.name}`, contents, (err) => {
		if(err) console.log(err);
		console.log('Image uploaded');
	})

	let queryString = 'INSERT INTO recipes (category, name, img, ingredients, steps) VALUES ($1, $2, $3, $4, $5)';
	client.query(queryString, [category, name, image.name, JSON.stringify(ingredients), JSON.stringify(steps)], (err, dbRes) => {
		if(err){
			console.log(err);
			res.sendStatus(500);
			return;
		}

		console.log('# Uploaded recipe to DB');
		res.json({code: 200});
	})

})

/**
 * Edits the recipe in the DB using the ID
 *
 * @param	id			-> The id of the recipe
 * @param	category	-> The category, in which the recipe will be added in
 * @param	name		-> The name of the recipe
 * @param	ingredients	-> The ingredientName and amount of the recipe
 * @param	steps		-> The steps
 */
app.post('/API/editRecipe', (req, res) => {
	var {
		id,
		category,
		name,
		ingredients,
		steps
	} = req.body;
	console.log(req.body);

	var queryString = 'UPDATE recipes SET category=$2, name=$3, ingredients=$4, steps=$5 WHERE id=$1';
	client.query(queryString, [id, category, name, JSON.stringify(ingredients), JSON.stringify(steps)], (err, dbRes) => {
		if(err){
			console.log(err);
			res.sendStatus(500);
			return;
		}
		console.log('Recipe updated');
		res.json({code: 200});
	})
})

/**
 * Removes the recipes in the ID array
 *
 * @param 	id	-> An array of recipes ID
 */
app.post('/API/removeRecipes', async (req, res) => {
	var { id } = req.body;

	var queryString = 'DELETE FROM recipes WHERE id=$1';
	for(var i = 0; i < id.length; i++){
		var dbRes = await client.query(queryString, [id[i]]);
	}

	res.json({code: 200});
})

/**
 * Gets all of the ingredients
 */
app.post('/API/getIngredients', (req, res) => {
	console.log('# Getting ingredients');

	var queryString = 'SELECT * FROM ingredients ORDER BY ingredientname';
	client.query(queryString, (err, dbRes) => {
		if(err){
			console.log(err);
			res.sendStatus(500);
			return;
		}

		var data = [];
		for(var i = 0; i < dbRes.rows.length; i++){
			data.push(dbRes.rows[i].ingredientname);
		}
		res.json({ data: data, message: '', code: 200 });
	})
})

/**
 * Updates the name of the recipe
 *
 * @param	recipeName	-> The name of the recipe
 * @param	newRecipeName	-> The new recipe name
 */
app.post('/API/updateIngredient', (req, res) => {
	console.log('# Updateing recipe');

	var recipeName = req.body.recipeName;
	var newRecipeName = req.body.newRecipeName;

	var queryString = 'UPDATE ingredients SET ingredientname=$2 WHERE ingredientname=$1';
	client.query(queryString, [recipeName, newRecipeName], (err, dbRes) => {
		if(err){
			console.log(err);
			res.sendStatus(500);
			return;
		}

		res.json({ code: 200 });
	})
})

/**
 * Searches for an item in the DB
 *
 * @param	searchValue	-> The value that is searched for
 * @param	category	-> The category in which the search in
 */
app.post('/API/searchItems', (req, res) => {
	var {
		searchValue,
		category
	} = req.body;

	var queryString = format("SELECT * FROM recipes WHERE category=$1 AND name LIKE '%s%%'", searchValue);
	client.query(queryString, [category], (err, dbRes) => {
		if(err){
			console.log(err)
			res.sendStatus(500);
			return;
		}

		res.json({ data: dbRes.rows, code: 200 });
	})
})

server.listen(PORT, function(){ console.log('Server is running on 0.0.0.0:' + PORT); });
