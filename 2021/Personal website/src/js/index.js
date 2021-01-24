let DOM;
let index = 0;
let charIndex = 0;
let typingSpeed = 100;

const TAB_SPACE = '&nbsp;&nbsp;';

function htmlDecode(input){
	if(typeof input === 'object'){
		let arr = [];
		input.forEach(el => {
			arr.push(htmlDecode(el));
		})

		return arr;
	} else {
		let doc = new DOMParser().parseFromString(input, 'text/html');
		return doc.documentElement.textContent;
	}
}
function htmlEncode(str){
	if(typeof str === 'object'){
		let arr = [];

		str.forEach(el => {
			arr.push(htmlEncode(el));
		});

		return arr;
	} else {
		let output = String(str).replace(/([^::])&/g, '$1&amp;').replace(/([^::]?)</g, '$1&lt;').replace(/([^::])>/g, '$1&gt;').replace(/([^::])"/g, '$1&quot;');
		output = replaceTabWithEntity(output);
		return output.replace(/::/g, '');
	}
}
function replaceTabWithEntity(str){
	return str.replace(/\t/g, TAB_SPACE);
}

async function writeHTML(){
	let currentSpeed;

	for(let index = 0; index < DOM.length; index++){
		let {
			typingSpeed: speed,
			target: targetDOM,
			text
		} = DOM[index];

		if(speed != undefined)
			currentSpeed = speed;

		for(let textIndex = 0; textIndex < text.length; textIndex++){

			for(let charIndex = 0; charIndex < text[textIndex].length; charIndex++){
				let character = text[textIndex][charIndex];

				if(character == '\t')
					character = TAB_SPACE;
			
				$(targetDOM).append(character);
				await sleep(currentSpeed);
			}


			if(textIndex + 1 < DOM[index].text.length)
				$(targetDOM).append('<br>');
		}


		let targetHTML = DOM[index].html;
		if(targetHTML != undefined){
			let html = $(targetDOM).html();
			html = html.replace(htmlEncode(text).join('<br>'), replaceTabWithEntity(targetHTML.join('')));

			$(targetDOM).html(html);
		} else {
			let html = $(targetDOM).html();
			html = html.replace(htmlEncode(text).join('<br>'), '');

			$(targetDOM).html(text.join(''));
		}
	}

}

async function loadHTML(){
	let url = `${location.origin}/data/html.json`;

	let response = await fetch(url);
	DOM = await response.json();
}

function sleep(ms){
	return new Promise(resolve => setTimeout(resolve, ms));
}

$(document).ready(async function(){
	await loadHTML();
	writeHTML();
});
