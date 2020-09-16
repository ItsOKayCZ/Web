/**
 * The API class
 *
 * Handles all of the API requests and response from the server
 *
 * TODO: In everything function implement error handling
 */
var API = {

	/**
	 * Sends a request to add a category
	 *
	 * @param	categoryName	-> The name of the category
	 */
	addCategory: async function(categoryName){
		var url = `${location.origin}/API/addCategory`;

		var response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ categoryName })
		})

		return await response.json();
	},

	/**
	 * Gets all of the categories from the DB
	 */
	getCategories: async function(){
		var url = `${location.origin}/API/getCategories`;

		var response = await fetch(url, {
			method: 'POST'
		})

		return await response.json();
	},

	/**
	 * Removes the categories by name in the array
	 *
	 * @param	categoryNames	-> The array of names to be removed
	 */
	removeCategories: async function(categoryNames){
		var url = `${location.origin}/API/removeCategories`;

		var response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ categoryNames })
		})

		return await response.json();
	},

	/**
	 * Gets all of the recipes of the category
	 *
	 * @param	categoryName	-> The name of the category
	 */
	getRecipes: async function(categoryName){
		var url = `${location.origin}/API/getRecipes`;

		var response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ categoryName })
		})
		
		return await response.json();
	}
}

/**
 * The prompt class
 */
var prompt = {
	preset: {
		addCategory: {
			html: `<label class='prompt-window-promptLabel' for='prompt-input'>Category name</label>
	<input data-form='true' id='prompt-input' class='prompt-window-prompt' name='prompt-input' type='text'>
	<button onclick='prompt.getInput();' id='prompt-window-button' class='prompt-window-promptButton'>Submit</button>`,
			headerText: 'Add category'
		},
		addRecipe: {
			html: `
				<label for='prompt-window-category'>Category:</label>
				<select data-form='true' id='prompt-window-category'>
					<option value='' selected disabled hidden>Please select a category</option>
				</select>

				<label for='prompt-window-name'>Name:</label>
				<input data-form='true' type='text' id='prompt-window-name'>

				<label>Image: <input data-form='true' type='file' accept='image/*'></label>
				<label>Ingredients:</label>
				<div class='prompt-window-ingredients'>
					<div class='prompt-ingredients-header'>
						<button class='prompt-ingredients-add'>+</button>
						<button class='prompt-ingredients-sub'>-</button>
					</div>
					<div class='prompt-ingredients'>
						<select data-form='true'>
							<option value='' selected disabled hidden>Please select an ingredient</option>
						</select>
						<input data-form='true' type='text'>
					</div>
				</div>
				<label>Steps:</label>
				<div class='prompt-window-steps'>
					<div class='prompt-steps-header'>
						<button class='prompt-steps-add'>+</button>
						<button class='prompt-steps-sub'>-</button>
					</div>
					<span>1.</span><textarea data-form='true'></textarea>
				</div>
				<button onclick='prompt.getInput();' id='prompt-window-button' class='prompt-window-promptButton'>Submit</button>
			`,
			headerText: 'Add recipe'
		}
	},
	promptDOM: document.getElementById('prompt-window'),
	promptInputDOM: null,
	promptHeaderDOM: document.getElementById('prompt-header'),
	promptContentDOM: document.getElementById('prompt-content'),
	cb: () => {},
	selectedPreset: undefined,

	/**
	 * TODO
	 * Make the system with element better
	 * For example:
	 * Using data attribute
	 */

	/**
	 * Displays the prompt window
	 *
	 * @param	preset	-> The preset that is chosen (addCategory; addRecipe)
	 * @param	cb	-> The callback function to be called after prompt is closed or
	 * 				after button is clicked
	 */
	display: function(preset, cb){
		this.setupPreset(preset);

		this.promptDOM.style.display = 'flex';

		this.cb = cb;

		if(this.selectedPreset == 'addRecipe'){
			this.setupForm();
		}
	},

	/**
	 * Setups the form
	 */
	setupForm: async function(){
		var categoryListDOM = document.getElementById('prompt-window-category');

		var categories = await API.getCategories();

		for(var i = 0; i < categories.length; i++){
			categoryListDOM.add(new Option(categories[i]));
		}
	},


	/**
	 * Setups the preset
	 *
	 * @param	presetName	-> The preset
	 */
	setupPreset: function(presetName){
		this.promptContentDOM.innerHTML = this.preset[presetName].html;

		this.promptHeaderDOM.innerHTML = this.preset[presetName].headerText;

		this.promptInputDOM = this.promptContentDOM.querySelectorAll('*[data-form="true"]');
		for(var i = 0; i < this.promptInputDOM.length; i++){
			this.promptInputDOM[i].value = '';
		}
		this.promptInputDOM[0].focus();

		this.selectedPreset = presetName;
	},

	/**
	 * Gets the input from the input DOM when user submits
	 */
	getInput: function(){
		var promptInputValues = {};

		for(var i = 0; i < this.promptInputDOM.length; i++){
			if(this.promptInputDOM[i].value == ''){
				this.promptInputDOM[i].style.borderColor = 'red';
				return;
			}
			this.promptInputDOM[i].style.borderColor = 'black';
			promptInputValues[this.promptInputDOM[i].name] = this.promptInputDOM[i].value;
		}

		this.cb(promptInputValues);
	},

	/**
	 * Adds a field for ingredients
	 */
	addIngredient: function(){
		var ingredientsDOM = document.getElementById('prompt-ingredients');

		ingredientsDOM.innerHTML += `
			<select data-form='true'>
				<option value='' selected disabled hidden>Please select an ingredient</option>
				<option value='New'>New ingredient</option>
			</select>
			<input data-form='true' type='text'>
		`;
	},

	/**
	 * Removes the last added ingredient
	 *
	 * TODO: Make this better -> the user can chose what ingredient to remove
	 */
	removeIngredient: function(){
		var ingredientsDOM = document.getElementById('prompt-ingredients');

		ingredientsDOM.children[ingredientsDOM.children.length - 1].remove();
		ingredientsDOM.children[ingredientsDOM.children.length - 1].remove();
	},

	/**
	 * Adds a step
	 */
	addStep: function(){
		alert('NOT DONE');
	},

	/**
	 * Removes the step that the user has
	 * currently selected
	 */
	removeStep: function(){
		alert('NOT DONE');
	},
	
	/**
	 * Closes the prompt window
	 */
	close: function(){
		this.promptDOM.style.display = 'none';
	}
}
document.getElementById('prompt-window-close').addEventListener('click', () => { prompt.close(); });

/**
 * Adds a recipe to the currently selected category
 */
function addRecipeToCategory(){
	prompt.display('addRecipe', async (data) => {
		console.log('Add recipe data: ');
		console.log(data);
	})
}

/**
 * Removes a recipe from the category list
 */
function removeRecipeToCategory(){

}

/**
 * Adds a category to the list
 */
function addCategory(){
	prompt.display('addCategory', async (data) => {
		var categoryName = data['prompt-input'];
		var response = await API.addCategory(categoryName);

		var code = displayServerResponse(response);
		if(code == 401){
			alert('Unauthorized');
			return;
		} else {
			displayCategories(categoryName);
			prompt.close();
		}
	});
}

/**
 * Removes a category from the list
 */
var removeCategoryMode = false;
async function removeCategory(){
	var categoryDOM = document.querySelectorAll('*[data-edit-category="false"]');
	var editCategoryDOM = document.querySelectorAll('*[data-edit-category="true"]');
	var removeButtonDOM = document.getElementById('remove-category-button');

	var removedCategories = [];
	var removedCategoriesDOM = [];
	if(removeCategoryMode){
		var messageBoxText = `Are you sure you want do delete the categories\n`;

		for(var i = 0; i < editCategoryDOM.length; i++){
			if(editCategoryDOM[i].querySelector('input[type="checkbox"]:checked') != null){
				removedCategoriesDOM.push([categoryDOM[i], editCategoryDOM[i]]);
				removedCategories.push(editCategoryDOM[i].innerText);
				messageBoxText += `- ${editCategoryDOM[i].innerText}\n`;
			}
		}

		if(removedCategories.length > 0){
			// TODO: Make a better confirm window
			if(confirm(messageBoxText)){
				displayServerResponse(await API.removeCategories(removedCategories));

				for(var i = 0; i < removedCategoriesDOM.length; i++){
					removedCategoriesDOM[i][0].remove();
					removedCategoriesDOM[i][1].remove();
				}
			}
		}
	}

	removeCategoryMode = !removeCategoryMode;

	var categoryDOMStyleDisplay = removeCategoryMode ? 'none' : '';
	var editCategoryDOMStyleDisplay = removeCategoryMode ? 'initial' : 'none';

	var removeButtonDOMBackgroundColor = removeCategoryMode ? '#f00' : '';
	var removeButtonDOMColor = removeCategoryMode ? 'black' : '';
	for(var i = 0; i < categoryDOM.length; i++){
		categoryDOM[i].style.display = categoryDOMStyleDisplay;
		editCategoryDOM[i].style.display = editCategoryDOMStyleDisplay;

		editCategoryDOM[i].querySelector('input[type="checkbox"]').checked = false;

		removeButtonDOM.style.backgroundColor = removeButtonDOMBackgroundColor;
		removeButtonDOM.style.color = removeButtonDOMColor;
	}

}

/**
 * Displays all of the items in the category
 *
 * @param	selectedDOM		-> The selected DOM element
 * @param	categoryName	-> The name of the category selected
 */
var selectedCategory = '';
async function selectCategory(selectedDOM, categoryName){
	selectedCategory = categoryName;

	var categoriesDOM = document.querySelectorAll('*[data-edit-category="false"]');
	for(var i = 0; i < categoriesDOM.length; i++){
		categoriesDOM[i].classList.toggle('selectedCategory', false);
	}
	selectedDOM.classList.toggle('selectedCategory', true);

	var recipes = await API.getRecipes(categoryName);

}

/**
 * Sets a filter that the user selected
 *
 * @param regexFilter	-> The regex filter
 */
function setFilter(regexFilter){

}

/**
 * Displays the selected item by id
 *
 * @param	itemId	-> The id of the item
 */
function selectItem(itemId){

}

/**
 * Displays a message window of the server response
 * 
 * @param	response	-> The server response
 */
function displayServerResponse(response){
	// TODO: Make a better alert box window
	alert(response.message);
	
	if(response.error != 200){
		// TODO: Error handling
		return;
	}
}

/**
 * Displays all of the categories
 *
 * @param	categoryName	-> The name of the category to be added to the list of categories
 */
async function displayCategories(categoryName){
	var categories;
	if(categoryName != undefined){
		categories = [categoryName];
	} else {
		categories = await API.getCategories();
	}
	var categoriesDOM = document.getElementById('categories');

	for(var i = 0; i < categories.length; i++){
		categoriesDOM.innerHTML += `<li data-edit-category='false' onclick='selectCategory(this, this.innerHTML);' class='category'>${categories[i]}</li>`;
		categoriesDOM.innerHTML += `<label data-edit-category='true'><li class='category'>${categories[i]}<input type='checkbox'></li></label>`;
	}
}
	
window.onload = function(){
	displayCategories();
}
