# TODO

## Description
A website for posting recipes

# Tasks
- [x] Make a design
- [x] Code the pages
	- [ ] Make the buttons react
		- [ ] Make the 'addRecipe' form preset look better
- [ ] Code the backend
	- [ ] Code the API endpoints

# DB scheme
DB name: onlinerecipes

## categories
categoryname (VARCHAR(255)): The name of the category

## recipes
category (VARCHAR(255)) (Dropbox): The name of the category, that the recipe is in
name (VARCHAR(255)) (text input): Name of recipe
img (VARCHAR(255)) (file input with preview): URL to image
ingredients (JSON) (dropbox with number input -> Can add ingredient): The ingredients
Structure:
[
	{
		name,
		amount
	}
]
		  
steps (JSON) (Can add text inputs): The steps 
[
	"Something",
	"Something 2"
]
