# TODO

## Description
A website for posting recipes

# Tasks
- [x] Make a design
- [x] Code the pages
- [x] Create the system for submitting the recipe
- [x] Create a page for the recipe
- [x] Add an edit button that is disabled, unless a recipe is selected
- [x] Add deletion where item is viewed
- [x] Add search bar
- [ ] Add functionality to the search bar
- [ ] Add authentication

# Bug
- [ ] When adding an ingredient, the previous ingredients get removed
- [ ] Can remove all ingredients input fields

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
