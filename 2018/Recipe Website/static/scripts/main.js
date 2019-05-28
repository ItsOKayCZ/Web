function changeContent(el){

	var category = el.parentElement.previousElementSibling.innerText;
	var name = el.innerText;
	
	var url = window.location.toString().split("/"); url.pop(); url = url.join("/");

	
	getFile(url, category, name);
	getImage(url, category, name);

}

function changeContext(file, name){

	var contextText = document.getElementsByClassName("contextText")[0];
	var header = document.getElementsByClassName("header")[0];
	var className = "headerText"

	header.innerHTML = "<h1 class='" + className + "'>" + name + "</h1>";



	if(file.readyState == 4){
		if(file.status == 200){

			file = file.responseText;			
			file = file.replace(/(?:\r\n|\r|\n)/g, '<br>');

			header.innerHTML = "<h1 class='" + className + "'>" + name + "</h1>";
			contextText.innerHTML = file;

		} else {

			header.innerHTML = "";
			contextText.innerHTML = "";

		}
	}

}

function changeImageWidth(imageDom){

	var p = document.getElementsByClassName("contextText")[0];

	if(imageDom.width != undefined){

		if(imageDom.width > p.clientWidth){
			imageDom.width = p.clientWidth;
		}

	}

}

function changeImage(image){

	var imageDom = document.getElementsByClassName("contextTextImage")[0];
	imageDom.removeAttribute("width");

	if(image.readyState == 4){
		if(image.status == 200){

			image = image.responseText.split(" ");
			
			if(image[1] != ""){
				imageDom.src = "data:image/" + image[0] + ";base64," + image[1];
				imageDom.onload = function(){
					changeImageWidth(imageDom);
				}
			} else {
				imageDom.src = "";
			}

		}
	}

}

function getImage(url, category, name){

	image = new XMLHttpRequest();

	image.open("GET", url + "/Food/" + category + "/" + name + "/image.txt", true);
	image.onreadystatechange = function(){
		changeImage(this)
	}

	image.send();

}

function getFile(url, category, name){

	file = new XMLHttpRequest();

	file.open("GET", url + "/Food/" + category + "/" + name + "/recipe.txt", true);
	file.onreadystatechange = function(){
		changeContext(this, name);
	};

	file.send();

}

window.onresize = function(){
	changeImageWidth(document.getElementsByClassName("contextTextImage")[0]);
}