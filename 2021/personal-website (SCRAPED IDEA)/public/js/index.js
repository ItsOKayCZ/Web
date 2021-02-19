let DOM;
let index = 0;
let charIndex = 0;
let typingSpeed = 100;
let animation = true;

const TAB_SPACE = '&nbsp;'.repeat(2);
const TAB_SPACE_CHAR = '\t'.repeat(1);

const DEBUG = true;
const PAUSE = false;

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
		let output = String(str)
			.replace(/([^::])&/g, '$1&amp;')
			.replace(/([^::]?)</g, '$1&lt;')
			.replace(/([^::])>/g, '$1&gt;')
			.replace(/\n/g, '<br>')
			// .replace(/([^::])"/g, '$1&quot;');
		output = replaceTabWithEntity(output);
		return output.replace(/::/g, '');
	}
}
function replaceTabWithEntity(str){
	return str.replace(/\t/g, TAB_SPACE);
}

function redirect(url){
	location.pathname = `/${url}`;
	// window.history.pushState({
	// 	'html': '<html></html>',
	// 	'pageTitle': url
	// }, '', url);
}

async function writeHTML(){
	let currentSpeed;

	for(let index = 0; index < DOM.length; index++){
		let {
			typingSpeed,
			target,
		} = DOM[index];

		let targetDOM = document.querySelector(target);

		if(typingSpeed != undefined)
			currentSpeed = typingSpeed;

		for(let htmlIndex = 0; htmlIndex < DOM[index].html.length; htmlIndex++){
			let {
				displayTag,
				tag,
				type,
				text,
				className,
				displayClassName,
				attributes,
				onload,
			} = DOM[index].html[htmlIndex];

			let indent = parseInt(targetDOM.parentNode.dataset.indent);

			if(displayClassName == undefined)
				displayClassName = true;

			let el;
			if(displayTag != undefined)
				el = document.createElement(displayTag);
			else
				el = document.createElement(tag);

			if(text != undefined)
				el.innerText = text;
			else
				el.innerHTML = '\n' + TAB_SPACE_CHAR.repeat(indent);

			if(className != undefined && displayClassName)
				el.classList.add(className);

			let elHTML = TAB_SPACE_CHAR.repeat(indent) + el.outerHTML;
			for(let i = 0; i < elHTML.length; i++){
				if(elHTML[i] == '\n')
					targetDOM.innerHTML += '<br>';
				else if(elHTML[i] == '\t')
					targetDOM.innerHTML += TAB_SPACE;
				else
					targetDOM.innerHTML += elHTML[i];

				if(animation)
					await sleep(currentSpeed);
			}

			let encodedHTML = htmlEncode(elHTML);

			if(type == 'text'){
				let html = document.createElement(tag);
				html.innerText = text;

				if(className != undefined)
					html.classList.add(className);

				targetDOM.innerHTML = targetDOM.innerHTML.replace(encodedHTML, '');

				let container = document.createElement('div');
				container.classList.add('inline');

				let leftTag = document.createElement('p');
				leftTag.classList.add('highlight-tag');
				leftTag.classList.add('left-tag');
				leftTag.innerHTML = `${TAB_SPACE.repeat(indent)}&lt;${tag}&gt;`;

				let rightTag = document.createElement('p');
				rightTag.classList.add('highlight-tag');
				rightTag.classList.add('right-tag');
				rightTag.innerText = `</${tag}>`;

				let content = document.createElement(tag);
				content.innerText = text;

				if(attributes != undefined){
					for(let attribute in attributes){
						content.setAttribute(attribute, attributes[attribute]);
					}
				}

				container.appendChild(leftTag);
				container.appendChild(content);
				container.appendChild(rightTag);

				targetDOM.appendChild(container);
			} else {
				let html = document.createElement(tag);
				if(text != undefined)
					html.innerText = text;
				
				if(className != undefined)
					html.classList.add(className);

				targetDOM.innerHTML = targetDOM.innerHTML.replace(encodedHTML, html.outerHTML);

				if(className != undefined)
					html = targetDOM.querySelector(`.${className}`);
				else
					html = targetDOM.querySelector(tag);

				html.parentNode.dataset.indent = indent + 1;

				if(attributes != undefined){
					for(let attribute in attributes){
						html.setAttribute(attribute, attributes[attribute]);
					}
				}

				let topTag = document.createElement('p');
				topTag.classList.add('highlight-tag');
				topTag.classList.add('top-tag');

				let bottomTag = document.createElement('p');
				bottomTag.classList.add('highlight-tag');
				bottomTag.classList.add('bottom-tag');

				if(displayTag != undefined){

					topTag.innerText = `<${displayTag}>`;
					if(className != undefined && displayClassName)
						topTag.innnerText = `<${displayTag} class="${className}">`

					bottomTag.innerText = `</${displayTag}>`;
				} else {
					topTag.innerText = `<${tag}>`;
					if(className != undefined && displayClassName)
						topTag.innerText = `<${tag} class="${className}">`;

					bottomTag.innerText = `</${tag}>`;
				}

				topTag.innerHTML = TAB_SPACE.repeat(indent) + htmlEncode(topTag.innerText);
				bottomTag.innerHTML = TAB_SPACE.repeat(indent) + htmlEncode(bottomTag.innerText);

				html.insertAdjacentElement('beforebegin', topTag);
				html.insertAdjacentElement('afterend', bottomTag);
			}

			if(onload != undefined)
				eval(onload);
		}
	}

}

function disableAnimation(){
	animation = !animation;

	let url = new URL(window.location);
	url.searchParams.set('animation', animation);
	window.history.pushState({}, '', url);
}

async function loadHTML(){
	if(DEBUG){
		let url = 'data/html.json';

		let response = await fetch(url);
		DOM = await response.json();

		return;
	}

	let page = location.pathname.substring(1);
	if(location.pathname == '/' || location.pathname == '/index.html'){
		page = 'index';
	}

	let url = `pages/?name=${page}`;

	let response = await fetch(url);
	DOM = await response.json();
	DOM = DOM[0].html;
}

function sleep(ms){
	return new Promise(resolve => setTimeout(resolve, ms));
}

function getQueryValue(key){
	let queryString = location.search;
	let params = new URLSearchParams(queryString);

	return params.get(key);
}

window.onload = async function(){
	await loadHTML();

	animation = getQueryValue('animation');
	animation = animation == undefined ? true : (animation == 'true');
	document.querySelector('#disable-animation').checked = !animation;

	if(!PAUSE)
		writeHTML();
}
