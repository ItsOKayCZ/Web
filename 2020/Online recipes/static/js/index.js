/**
 * The API class
 *
 * Handles all of the API requests and response from the server
 *
 * TODO: In everything function implement error handling
 */
var API = {

	/**
	 * Checks if user is authorized and if not, logs the user in
	 *
	 * @param	statusCode	-> The status code of the response
	 */
	checkIfAuthorized: async function(statusCode){
		if(statusCode != 401)
			return;

		var url = `${location.origin}/login`;

		var username = prompt('Enter username:');
		var password = prompt('Enter password:');

		var response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, password })
		});
	
		if(response.status == 200){
			alert('Successfully logged in');
		} else {
			alert('Username or password are incorrect');
		}

		window.location.reload();
	},

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

		await this.checkIfAuthorized(response.status);

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
	 * Add recipes to DB
	 *
	 * @param	category	-> The name of the category to add the recipe to
	 * @param	image		-> The base64 encoding of the image
	 * @param	ingredients	-> The name of the ingredient and amount
	 * @param	name		-> The name of the recipe
	 * @param	steps		-> Documentation of every step
	 */
	addRecipe: async function(data){
		var url = `${location.origin}/API/addRecipe`;

		var response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(data)
		})
	},

	/**
	 * Edits the recipe in DB using the ID
	 *
	 * @param	data	-> The data to be edited
	 */
	editRecipe: async function(data){
		var url = `${location.origin}/API/editRecipe`;

		console.log(data);
		var response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(data)
		})
	},

	/**
	 * Gets all of the recipes of the category
	 *
	 * @param	categoryName	-> The name of the category
	 * @param	order			-> The order in which the recipes will be sorted by
	 */
	getRecipes: async function(categoryName, order){
		var url = `${location.origin}/API/getRecipes`;

		var response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ categoryName, order })
		})
		
		return await response.json();
	},

	/**
	 * Gets the recipe using the id
	 *
	 * @param	id	-> The id of the recipe
	 */
	getRecipe: async function(id){
		var url = `${location.origin}/API/getRecipe`;

		var response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({ id })
		})

		return await response.json();
	},

	/**
	 * Removes the recipes with specified ID
	 *
	 * @param	id	-> The array of the IDs
	 */
	removeRecipes: async function(id){
		var url = `${location.origin}/API/removeRecipes`;

		var response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({ id })
		})

		return await response.json();
	},

	/**
	 * Updates the recipe name
	 *
	 * @param	recipeName	-> The recipe name to be changed
	 * @param	newRecipeName	-> The new recipe name
	 */
	updateIngredient: async function(recipeName, newRecipeName){
		var url = `${location.origin}/API/updateIngredient`;

		var response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({ recipeName, newRecipeName })
		})
	},

	/**
	 * Gets all of the ingredients made by the user
	 */
	getIngredients: async function(){
		var url = `${location.origin}/API/getIngredients`;

		var response = await fetch(url, {
			method: 'POST'
		})

		return await response.json();
	},

	/**
	 * Search for items in the DB
	 *
	 * @param searchValue
	 * @param category
	 */
	searchItems: async function(searchValue, category){
		var url = `${location.origin}/API/searchItems`;

		var response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({ searchValue, category })
		});

		return await response.json();
	}
}

/**
 * The prompt class
 */
var Prompt = {
	preset: {
		addCategory: {
			html: `<label class='prompt-window-promptLabel' for='prompt-input'>Category name</label>
	<input data-form='true' id='prompt-input' class='prompt-window-prompt' name='prompt-input' type='text'>
	<button onclick='Prompt.getInput();' id='prompt-window-button' class='prompt-window-promptButton'>Submit</button>`,
			headerText: 'Add category'
		},
		addRecipe: {
			html: `
				<label for='prompt-window-category'>Category:</label>
				<select name='category' data-form='true' id='prompt-window-category'>
					<option value='' selected disabled hidden>Please select a category</option>
					%dataCategories%
				</select>

				<label for='prompt-window-name'>Name:</label>
				<input name='name' data-form='true' type='text' id='prompt-window-name'>

				<label>Image: <input name='image' data-form='true' type='file' accept='image/*'></label>
				<div class='prompt-window-ingredients'>
					<div class='prompt-ingredients-header'>
						<p>Ingredients:</p>
						<div>
							<button title='Adds an ingredient to the end' onclick='prompt.addIngredient()' class='prompt-ingredients-add'>+</button>
							<button title='Removes the selected ingredients' onclick='prompt.removeIngredient()' class='prompt-ingredients-sub'>-</button>
						</div>
					</div>
					<div id='prompt-ingredients' class='prompt-ingredients'>
						<input placeholder='Please enter an ingredient' data-form='true' type='text' name='ingredientName' list='ingredients'>
						<input name='ingredientAmount' placeholder='Enter amount' data-form='true' type='text'>
					</div>
					<datalist id='ingredients'>
						%dataIngredients%
					</datalist>
				</div>
				<div class='prompt-window-steps'>
					<div class='prompt-steps-header'>
						<p id='prompt-step-counter'>Steps (1):</p>
						<div>
							<button title='Adds a step to the end' onclick='prompt.addStep()' class='prompt-steps-add'>+</button>
							<button title='Removes the step currently looking at' onclick='prompt.removeStep()' class='prompt-steps-sub'>-</button>
						</div>
					</div>
					<div class='step'>
						<div>
							<span onclick='prompt.previousStep()' class='arrow'>▲</span>
							<span id='amountOfSteps' class='amountOfSteps'>1</span>
							<span onclick='prompt.nextStep()' class='arrow'>▼</span>
						</div>
						<textarea name='steps' data-variable='steps' autocomplete='off' onkeyup='prompt.updateStep()' id='prompt-window-step' data-form='true'></textarea>
					</div>
				</div>
				<button onclick='prompt.getInput();' id='prompt-window-button' class='prompt-window-promptButton'>Submit</button>
			`,
			headerText: 'Add recipe'
		},

		editRecipe: {
			html: `
				<label for='prompt-window-category'>Category:</label>
				<select name='category' data-form='true' id='prompt-window-category'>
					%dataCategories%
				</select>

				<label for='prompt-window-name'>Name:</label>
				<input name='name' value='%dataName%' data-form='true' type='text' id='prompt-window-name'>

				<div class='prompt-window-ingredients'>
					<div class='prompt-ingredients-header'>
						<p>Ingredients:</p>
						<div>
							<button title='Adds an ingredient to the end' onclick='prompt.addIngredient()' class='prompt-ingredients-add'>+</button>
							<button title='Removes the selected ingredients' onclick='prompt.removeIngredient()' class='prompt-ingredients-sub'>-</button>
						</div>
					</div>
					<div id='prompt-ingredients' class='prompt-ingredients'>
						%dataIngredientsDOM%
					</div>
					<datalist id='ingredients'>
						%dataIngredients%
					</datalist>
				</div>
				<div class='prompt-window-steps'>
					<div class='prompt-steps-header'>
						<p id='prompt-step-counter'>Steps (1):</p>
						<div>
							<button title='Adds a step to the end' onclick='prompt.addStep()' class='prompt-steps-add'>+</button>
							<button title='Removes the step currently looking at' onclick='prompt.removeStep()' class='prompt-steps-sub'>-</button>
						</div>
					</div>
					<div class='step'>
						<div>
							<span onclick='prompt.previousStep()' class='arrow'>▲</span>
							<span id='amountOfSteps' class='amountOfSteps'>1</span>
							<span onclick='prompt.nextStep()' class='arrow'>▼</span>
						</div>
						<textarea name='steps' data-variable='steps' autocomplete='off' onkeyup='prompt.updateStep()' id='prompt-window-step' data-form='true'>%dataStep%</textarea>
					</div>
				</div>
				<button onclick='prompt.getInput();' id='prompt-window-button' class='prompt-window-promptButton'>Submit</button>
			`,
			headerText: 'Edit recipe',
			ingredientInput: `
				<input value='%ingredientName%' placeholder='Please enter an ingredient' data-form='true' type='text' name='ingredientName' list='ingredients'>
				<input value='%ingredientAmount%' name='ingredientAmount' placeholder='Enter amount' data-form='true' type='text'>
			`
		}
	},
	promptDOM: document.getElementById('prompt-window'),
	promptInputDOM: null,
	promptHeaderDOM: document.getElementById('prompt-header'),
	promptContentDOM: document.getElementById('prompt-content'),
	cb: () => {},
	selectedPreset: undefined,
	steps: [""],
	stepIndex: 0,

	/**
	 * Displays the prompt window
	 *
	 * @param	preset	-> The preset that is chosen (addCategory; addRecipe)
	 * @param	cb	-> The callback function to be called after prompt is closed or
	 * 				after button is clicked
	 * @param	data	-> The data to parse into the form
	 */
	display: function(preset, cb, data={}){
		this.setupPreset(preset, data);

		this.cb = cb;

		if(this.selectedPreset == 'addRecipe' || this.selectedPreset == 'editRecipe'){
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
	 * @param	data		-> Data to be added into the form
	 */
	setupPreset: async function(presetName, data){
		this.promptDOM.style.display = 'flex';

		var html = this.preset[presetName].html;

		if(presetName == 'addRecipe' || presetName == 'editRecipe'){
			var ingredients = await API.getIngredients();
			ingredients = ingredients.data;
			var dataDOM = '';
			for(var i = 0; i < ingredients.length; i++){
				dataDOM += `<option value='${ingredients[i]}'>${ingredients[i]}</option>`;
			}
			
			html = html.replace('%dataIngredients%', dataDOM);

			var categories = await API.getCategories();
			var dataDOM = '';
			for(var i = 0; i < categories.length; i++){
				dataDOM += `<option value='${categories[i]}'>${categories[i]}</option>`;
			}
			html = html.replace('%dataCategories%', dataDOM);
		}

		if(presetName == 'editRecipe'){
			html = html.replace(/\%dataName\%/g, data.name);

			var ingredientsDOM = '';
			for(var i = 0; i < data.ingredients.length; i++){
				ingredientsDOM += this.preset[presetName].ingredientInput;
				ingredientsDOM = ingredientsDOM.replace(/\%ingredientName\%/g, data.ingredients[i].name);
				ingredientsDOM = ingredientsDOM.replace(/\%ingredientAmount\%/g, data.ingredients[i].amount);
			}
			html = html.replace(/\%dataIngredientsDOM\%/g, ingredientsDOM);

			this.steps = [ ...data.steps ];
			html = html.replace(/\%dataStep\%/g, data.steps[0]);
		}

		this.promptContentDOM.innerHTML = html;
		this.promptHeaderDOM.innerHTML = this.preset[presetName].headerText;

		this.promptInputDOM = this.promptContentDOM.querySelectorAll('*[data-form="true"]');
		if(presetName != 'editRecipe'){
			for(var i = 0; i < this.promptInputDOM.length; i++){
				this.promptInputDOM[i].value = '';
			}
		}
		this.promptInputDOM[0].focus();


		this.selectedPreset = presetName;

		if(presetName == 'addRecipe' || presetName == 'editRecipe'){

			var ingredientsDOM = document.querySelector('input[name="ingredientName"]');
			ingredientsDOM.onselect = (e) => { 
				e.target.previousSelection = e.target.value;
				e.target.editing = true; 
			};
			ingredientsDOM.onkeyup = (e) => { 

				if(e.target.value == '') { 
					e.target.editing = false; 
				}
			};
			ingredientsDOM.onblur = (e) => {
				if(e.target.editing && e.target.previousSelection != e.target.value){
					API.updateIngredient(e.target.previousSelection, e.target.value);

					var dataListDOM = document.getElementById('ingredients');
					var optionDOM = dataListDOM.querySelector(`option[value="${e.target.previousSelection}"]`);
					optionDOM.value = e.target.value;
					optionDOM.innerHTML = e.target.value;
				}
				e.target.editing = false;
			}

			ingredientsDOM.editing = false;
		}
	},

	/**
	 * Gets the input from the input DOM when user submits
	 */
	getInput: function(){
		this.promptInputDOM = document.querySelectorAll('*[data-form="true"]');
		var promptInputValues = {};

		for(var i = 0; i < this.promptInputDOM.length; i++){
			var value = this.promptInputDOM[i].value;
			if(this.promptInputDOM[i].dataset.variable != undefined){
				value = this[this.promptInputDOM[i].dataset.variable];
			} else if(this.promptInputDOM[i].tagName == 'INPUT' && this.promptInputDOM[i].type == 'file'){
				value = this.promptInputDOM[i].files[0];
			}
			
			if(this.promptInputDOM[i].tagName == 'INPUT' && this.promptInputDOM[i].type == 'file'
				&& this.promptInputDOM[i].files.length == 0){
				this.promptInputDOM[i].style.borderColor = 'red';
				return;
			}
			if(value == '' || isEmpty(value)){
				this.promptInputDOM[i].style.borderColor = 'red';
				return;
			}
			this.promptInputDOM[i].style.borderColor = 'black';

			var name = this.promptInputDOM[i].name;
			if(typeof(promptInputValues[name]) == 'object'){
				promptInputValues[name].push(value);
			} else if(promptInputValues[name] != undefined){
				promptInputValues[name] = [promptInputValues[name], value];
			} else {
				promptInputValues[this.promptInputDOM[i].name] = value;
			}
		}

		this.cb(promptInputValues);
	},

	/**
	 * Adds a field for ingredients
	 */
	addIngredient: function(){
		var ingredientsDOM = document.getElementById('prompt-ingredients');

		ingredientsDOM.innerHTML += `
			<input placeholder='Please enter an ingredient' data-form='true' type='text' name='ingredientName' list='ingredients'>
			<input placeholder='Enter amount' name='ingredientAmount' data-form='true' type='text'>
		`;
	},

	/**
	 * Gets the ingredient that the user will add
	 *
	 * TODO: Change the select to a input type='text' and after onblur change it back
	 */
	getIngredient: function(){
		alert('NOT DONE');
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
		this.steps.push("");
		this.stepIndex++;
		this.updateStepUI();
	},

	/**
	 * Updates the current step context
	 */
	updateStep: function(){
		var textareaDOM = document.getElementById('prompt-window-step')
		this.steps[this.stepIndex] = textareaDOM.value;
	},

	/**
	 * Removes the step that the user has
	 * currently selected
	 */
	removeStep: function(){
		if(this.steps.length == 1){
			return;
		}

		this.steps.splice(this.stepIndex, 1);
		if(this.stepIndex >= this.steps.length){
			this.stepIndex = this.steps.length - 1;
		}

		this.updateStepUI();
	},

	/**
	 * Displays the previous step
	 */
	previousStep: function(){
		var index = this.stepIndex - 1;
		if(index >= 0){
			this.updateStepUI(index);
		}
	},

	/**
	 * Displays the next step
	 */
	nextStep: function(){
		var index = this.stepIndex + 1;
		if(index < this.steps.length){
			this.updateStepUI(index);
		}
	},

	/**
	 * Updates the step UI
	 *
	 * @param	index	-> The index of the step
	 */
	updateStepUI: function(index){
		this.stepIndex = index == undefined ? this.stepIndex : index;
		document.getElementById('prompt-window-step').innerHTML = this.steps[this.stepIndex];
		document.getElementById('prompt-step-counter').innerHTML = `Steps (${this.steps.length}):`;
		document.getElementById('amountOfSteps').innerHTML = this.stepIndex + 1;
		document.getElementById('prompt-window-step').value = this.steps[this.stepIndex];
	},
	
	/**
	 * Closes the prompt window
	 */
	close: function(){
		this.promptDOM.style.display = 'none';

		this.stepIndex = 0;
		this.steps = [""];
	}
}
document.getElementById('prompt-window-close').addEventListener('click', () => { Prompt.close(); });

/**
 * Checks the elements are empty in a string
 * 
 * @param	arr	-> The array
 */
function isEmpty(arr){
	if(typeof(arr) != 'object')
		return false;

	for(var i = 0; i < arr.length; i++){
		if(arr[i] == ''){
			return true;
		}
	}
	return false;
}
/**
 * Adds a recipe to the currently selected category
 */
function addRecipeToCategory(){
	Prompt.display('addRecipe', async (rawData) => {
		var data = Object.assign({}, rawData);

		data.ingredients = [];
		if(typeof(data.ingredientName) != 'string'){
			for(var i = 0; i < data.ingredientName.length; i++){
				data.ingredients.push({
					name: data.ingredientName[i],
					amount: data.ingredientAmount[i]
				})
			}
		} else {
			data.ingredients = [
				{
					name: data.ingredientName,
					amount: data.ingredientAmount
				}
			]
		}

		delete data.ingredientName;
		delete data.ingredientAmount;

		var reader = new FileReader();
		reader.readAsDataURL(data.image);
		reader.onload = (e) => {
			data.image = {
				name: data.image.name,
				data: e.target.result
			}
			API.addRecipe(data);
			Prompt.close();

			var selectedCategoryEl = document.querySelector('.selectedCategory');
			selectCategory(selectedCategoryEl, data.category);
		}
	})
}

/**
 * Displays a window, where a user can edit the selected recipe
 */
function editRecipeFromCategory(){
	var recipeDOM = document.getElementById('recipe');

	var keys = Object.keys(recipeDOM.dataset);
	var data = {};
	for(var i = 0; i < keys.length; i++){
		data[keys[i]] = recipeDOM.dataset[keys[i]];
	}
	data.ingredients = JSON.parse(data.ingredients);
	data.steps = JSON.parse(data.steps);

	Prompt.display('editRecipe', async (rawData) => {
		var data = Object.assign({}, rawData);

		data.ingredients = [];
		if(typeof(data.ingredientName) != 'string'){
			for(var i = 0; i < data.ingredientName.length; i++){
				data.ingredients.push({
					name: data.ingredientName[i],
					amount: data.ingredientAmount[i]
				})
			}
		} else {
			data.ingredients = [
				{
					name: data.ingredientName,
					amount: data.ingredientAmount
				}
			]
		}

		delete data.ingredientName;
		delete data.ingredientAmount;

		data.id = recipeDOM.dataset.id;
		API.editRecipe(data);
		Prompt.close();
		selectItem(data.id);

	}, data);
}

/**
 * Removes a recipe from the category list
 *
 * @param	button	-> The button selected
 */
var removeMode = false;
async function removeRecipeInCategory(button){
	var itemsDOM = document.getElementById('items');
	if(itemsDOM.firstElementChild.tagName == 'H1'){
		return;
	}
	removeMode = !removeMode;
	button.classList.toggle('selected-remove-button');

	var recipeDOM = document.getElementById('recipe');

	if(!removeMode){
		var recipes = document.getElementsByClassName('selected-item');
		if(recipes.length == 0)
			return;

		var message = 'Are you sure you want to delete the selected recipes:\n';

		for(var i = 0; i < recipes.length; i++){
			message += `- ${recipes[i].lastElementChild.innerHTML}\n`;
		}

		if(confirm(message)){
			var id = [];
			for(var i = 0; i < recipes.length; i++){
				id.push(recipes[i].dataset.id);
			}
			var response = await API.removeRecipes(id);
			if(response.code == 200){
				for(var i = 0; i < recipes.length; i++){
					recipes[i].remove();
				}
			} else {
				alert('An error has occured');
			}

		} else {
			for(var i = 0 ; i < recipes.length; i++){
				recipes[i].classList.toggle('selected-item', false);
			}
		
		}
	} else if(recipeDOM.style.display != 'none' && confirm('Are you sure you want to delete this recipe')){
		var id = [recipeDOM.dataset.id];

		var response = await API.removeRecipes(id);
		if(response.code == 200){
			var selectedCategoryDOM = document.querySelector('.selectedCategory');
			selectCategory(selectedCategoryDOM, selectedCategoryDOM.innerHTML);
		} else {
			alert('An error has occured');
		}
		removeMode = !removeMode;
		button.classList.toggle('selected-remove-button');
	}
}

/**
 * Adds a category to the list
 */
function addCategory(){
	Prompt.display('addCategory', async (data) => {
		var categoryName = data['prompt-input'];
		var response = await API.addCategory(categoryName);

		var code = displayServerResponse(response);
		if(code == 401){
			alert('Unauthorized');
			return;
		} else {
			displayCategories(categoryName);
			Prompt.close();
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
 * @param	_data			-> The already queried recipes
 */
var selectedCategory = '';
async function selectCategory(selectedDOM, categoryName, _data=undefined){
	selectedCategory = categoryName;

	var categoriesDOM = document.querySelectorAll('*[data-edit-category="false"]');
	for(var i = 0; i < categoriesDOM.length; i++){
		categoriesDOM[i].classList.toggle('selectedCategory', false);
	}
	selectedDOM.classList.toggle('selectedCategory', true);

	var data;
	if(_data == undefined){
		data = await API.getRecipes(categoryName, order);
		data = data.data;
	} else {
		data = _data;
	}

	var recipeTemplateDOM = `
		<div data-id='%id%' onclick='selectItem(this.dataset.id, this);' class='item'>
			<img class='item-image' src='/recipeImages/%img%'>
			<p class='item-name'>%name%</p>
		</div>
	`

	document.getElementById('recipe').style.display = 'none';
	document.querySelector('content').style.display = '';

	disableHeaderButtons(false, true, false);
	let itemsDOM = document.getElementById('items');
	if(data.length == 0){
		itemsDOM.style.display = 'flex';
		itemsDOM.innerHTML = '<h1>There are no recipes in the category ¯\\_(ツ)_/¯</h1>';
		return;
	}

	itemsDOM.innerHTML = '';
	itemsDOM.style.display = 'grid';
	for(var i = 0; i < data.length; i++){
		var recipeDOM = recipeTemplateDOM;;
		
		recipeDOM = recipeDOM.replace(/\%id\%/g, data[i].id);
		recipeDOM = recipeDOM.replace(/\%img\%/g, data[i].img);
		recipeDOM = recipeDOM.replace(/\%name\%/g, data[i].name);

		itemsDOM.innerHTML += recipeDOM;
	}
}

/**
 * Sets a filter that the user selected
 *
 * @param _order	-> The order of the sorting
 */
var order = 'ASC';
function setFilter(_order){
	order = _order;
	selectCategory(document.querySelector('.selectedCategory'), selectedCategory);
}

/**
 * Displays the selected item by id
 *
 * @param	itemId	-> The id of the item
 * @param	el		-> The selected DOM
 */
async function selectItem(itemId, el){
	if(removeMode){
		el.classList.toggle('selected-item');
		return;
	}

	var data = await API.getRecipe(itemId);
	data = data.data;


	// Name
	document.getElementById('recipe-name').innerHTML = data.name;
	
	// Image
	document.getElementById('recipe-image').src = `/recipeImages/${data.img}`;

	// Ingredients
	var recipeTemplateDOM = `
		<div class='recipe-ingredient'><p>%ingredientName%</p><p>%ingredientAmount%</p></div>
	`;
	var ingredientsDOM = document.getElementById('recipe-ingredients');
	ingredientsDOM.innerHTML = '';
	for(var i = 0; i < data.ingredients.length; i++){

		ingredientsDOM.innerHTML += recipeTemplateDOM
		.replace(/\%ingredientName\%/g, data.ingredients[i].name)
		.replace(/\%ingredientAmount\%/g, data.ingredients[i].amount);
	}

	// Steps
	var stepTemplateDOM = `
		<div class='recipe-step'>
			<span class='step-circle'>%count%</span>
			<p>%step%</p>
		</div>
	`
	var stepsDOM = document.getElementById('recipe-steps');
	stepsDOM.innerHTML = '';
	for(var i = 0; i < data.steps.length; i++){
		stepsDOM.innerHTML += stepTemplateDOM
		.replace(/\%count\%/g, i + 1)
		.replace(/\%step\%/g, data.steps[i]);
	}

	var recipeDOM = document.getElementById('recipe');
	recipeDOM.style.display = 'flex';

	// Setting info about item into DOM
	recipeDOM.dataset.category = data.category;
	recipeDOM.dataset.id = data.id;
	recipeDOM.dataset.ingredients = JSON.stringify(data.ingredients);
	recipeDOM.dataset.name = data.name;
	recipeDOM.dataset.steps = JSON.stringify(data.steps);

	document.querySelector('content').style.display = 'none';

	disableHeaderButtons(false, false, true);
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

/**
 * Searches for the item in the selected category
 *
 * @param	searchValue	-> The value in the searchbar
 * @param	category	-> In which category to search in
 */
async function searchItems(searchValue, category){
	if(searchValue == ''){
		selectCategory(document.querySelector('.selectedCategory'), selectedCategory);
		return;
	}

	var data = (await API.searchItems(searchValue, category)).data;
	selectCategory(document.querySelector('.selectedCategory'), selectedCategory, data);
}

/**
 * Enables or disables the header button
 *
 * @param	headerButtonsStatestate	-> The state of the buttons
 * @param	editButtonState			-> The state of the edit button
 * @param	searchbarState			-> The state of the search bar
 */
function disableHeaderButtons(headerButtonsState, editButtonState, searchbarState){
	var headerButtonDOMs = document.querySelectorAll('.header-button:first-child, .header-button:last-child');

	for(var i = 0; i < headerButtonDOMs.length; i++){
		headerButtonDOMs[i].disabled = headerButtonsState;
	}

	document.querySelector('.header-button:nth-child(2)').disabled = editButtonState;

	document.querySelector('#searchbar').disabled = searchbarState;
	document.querySelector('#searchbar').placeholder = !searchbarState ? 'Vyhledat' : '';
	document.querySelector('#search').style.backgroundColor = searchbarState ? '#5a606f' : '';
}
	
window.onload = function(){
	displayCategories();
	disableHeaderButtons(true, true, true);

	var searchbarDOM = document.querySelector('#searchbar');
	searchbarDOM.onkeyup = (e) => {
		if(e.keyCode == 13){
			searchItems(searchbarDOM.value, selectedCategory);
		}
	}
}
