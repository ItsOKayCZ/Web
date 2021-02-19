async function getProjects(){
	let url = 'https://raw.githubusercontent.com/ItsOKayCZ/Web/master/README.md';

	let response = await fetch(url);
	let text = await response.text();
	text = text.match(/\- \[.*]\((.*)\)/g);

	let projectsURL = [];

	for(let i = 0; i < text.length; i++){
		let projectURL = text[i].match(/https:\/\/.*$/g)[0].slice(0, -1);

		projectsURL.push(projectURL);
	}

	return projectsURL;
}

async function displayProjects(){
	let projectsURL = await getProjects();
	let DOM = document.querySelector('.projects');

	for(let i = 0; i < projectsURL.length; i++){
		let iframe = document.createElement('iframe');
		iframe.src = projectsURL[i];
		iframe.width = iframe.height = '100px';

		DOM.appendChild(iframe);
	}
}
