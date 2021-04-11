class SceneManager{
	previousPartIndex = 0;
	partIndex = 2;
	partOffsets = [];
	scrollOrigin = 0;
	sceneNamePrefix = 'Scene';

	sceneActions = {};

	constructor({ scene, parts, scrollDOMSelector, sceneActions }){
		this.scene = scene;

		this.scrollDOM = document.querySelector(scrollDOMSelector);
		this.parts = parts;
		this.partHeight = this.scrollDOM.children[0].clientHeight;

		for(let i = 0; i < this.parts; i++){
			this.partOffsets.push(i * this.partHeight);
		}

		this.setupEventsForNavButtons();

		this.scrollDOM.addEventListener('scroll', (e) => { this.onScroll(e) });
		// this.scrollDOM.onscroll = (e) => { this.onScroll(e); } ;

		this.sceneActions = sceneActions || {};

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

	getCurrentSceneName(){
		return this.sceneNamePrefix + (this.partIndex + 1);
	}

	changeScene(e){
		let button = e.target;

		this.previousPartIndex = this.partIndex;
		this.partIndex = parseInt(button.dataset.sceneId);

		this.updateScrollBar();
		this.update();
	}

	updateScrollBar(){
		this.scrollDOM.scrollTop = this.partHeight * this.partIndex;
		this.scrollOrigin = this.scrollDOM.scrollTop;
	}

	update(){
		this.displayScene();
		this.updateNavButtons();
		this.checkSceneActions();
	}

	checkSceneActions(){
		if(this.previousPartIndex == this.partIndex)
			return;

		let previousSceneActions = this.sceneActions[this.previousPartIndex];
		let currentSceneActions = this.sceneActions[this.partIndex];

		if(previousSceneActions != undefined && previousSceneActions.exit != undefined)
			previousSceneActions.exit();

		if(currentSceneActions != undefined && currentSceneActions.enter != undefined)
			currentSceneActions.enter();
	}

	onScroll(e){
		let scrollTop = this.scrollDOM.scrollTop;
		for(let i = 0; i < this.partOffsets.length; i++){
			if(this.partOffsets[i + 1] == undefined && this.partOffsets[i] == scrollTop){
				this.partIndex = i;
			} else if(scrollTop >= this.partOffsets[i] && scrollTop < this.partOffsets[i + 1]){
				this.partIndex = i;
			}
		}

		this.previousPartIndex = this.partIndex;

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

	displayScene(){
		for(let i = 0; i < this.parts; i++){
			let sceneObjects = this.scene.getObjectByName(this.sceneNamePrefix + (i + 1), true);
			sceneObjects.visible = false;
		}

		let mainObjects = this.scene.getObjectByName(this.sceneNamePrefix + (this.partIndex + 1));
		mainObjects.visible = true;
	}
}
