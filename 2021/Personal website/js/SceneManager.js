class SceneManager{
	partIndex = 0;
	partOffsets = [];
	scrollOrigin = 0;

	constructor({ scene, parts, scrollDOMSelector }){
		this.scene = scene;

		this.scrollDOM = document.querySelector(scrollDOMSelector);
		this.parts = parts;
		// this.setupParts();
		this.partHeight = this.scrollDOM.children[0].clientHeight;

		for(let i = 0; i < this.parts; i++){
			this.partOffsets.push(i * this.partHeight);
		}

		this.setupEventsForNavButtons();

		this.scrollDOM.onscroll = (e) => { this.onScroll(e); } ;

		this.update();
	}

	setupEventsForNavButtons(){
		let buttons = document.querySelectorAll('.navigation button');

		for(let i = 0; i < buttons.length; i++){

			buttons[i].onclick = (e) => {
				this.changeScene(e);
			}
		}
	}

	changeScene(e){
		let button = e.target;

		this.partIndex = parseInt(button.dataset.sceneId);

		this.update();
	}

	update(){
		this.displayScene();
		this.updateNavButtons();
	}

	onScroll(e){
		if(this.scrollDOM.scrollTop > this.scrollOrigin){
			this.partIndex++;
		} else if(this.scrollDOM.scrollTop < this.scrollOrigin){
			this.partIndex--;
		}

		if(this.partIndex < 0)
			this.partIndex = 0;
		else if(this.partIndex >= this.parts)
			this.partIndex = this.parts - 1;

		this.update();
		this.scrollOrigin = this.scrollDOM.scrollTop;
	}

	updateNavButtons(){
		let buttons = document.querySelectorAll('.navigation button');

		for(let i = 0; i < buttons.length; i++){
			let state = i == this.partIndex;
			buttons[i].classList.toggle('activeButton', state);
		}
	}

	setupParts(){
		for(let i = 0; i < this.parts; i++){
			let partDOM = document.createElement('div');
			partDOM.classList.add('scrollPart');

			this.scrollDOM.appendChild(partDOM);
		}
	}
	
	animationSpeed = 20;
	displayScene(){
		for(let i = 0; i < this.parts; i++){
			let sceneObjects = this.scene.getObjectByName(`Scene${i + 1}`, true);
			sceneObjects.visible = false;
		}

		let mainObjects = this.scene.getObjectByName(`Scene${this.partIndex + 1}`);
		mainObjects.visible = true;
	}
}
