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
const { Client } = require('pg');
require('dotenv').config({ path: './.env' });

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
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('static'));

/**
 * ##############
 * API 
 * ############## 
 */
/** 
 * Authentication of the user 
 */ 
app.use('/API/*', (req, res, next) => {
	// TODO: Authentication
	if(req.cookies.id == undefined || req.cookies.id != process.env.authCookie){
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
 */
app.post('/API/getRecipes', (req, res) => {
	var categoryName = req.body.categoryName;

	console.log(`# Getting recipes of category ${categoryName}`);


	var queryString = 'SELECT * FROM recipes WHERE category=$1';
	client.query(queryString, [categoryName], (err, dbRes) => {
		if(err){
			console.log(err);
			res.sendStatus(500);
			return;
		}

		console.log(dbRes.rows);
		res.json({ data: dbRes.rows[0], message: '', code: 200 });
	})
})

server.listen(PORT, function(){ console.log('Server is running on 0.0.0.0:' + PORT); });
