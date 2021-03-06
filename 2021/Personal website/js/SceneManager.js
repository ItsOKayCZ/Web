import * as TWEEN from './tween.esm.js';

export default class SceneManager{
	partIndex = 0;
	previousPartIndex = this.partIndex;
	displayedSceneIndex = this.partIndex;
	partOffsets = [];
	scrollOrigin = 0;
	sceneNamePrefix = 'Scene';

	sceneActions = {};

	isAnimation = false;
	isSceneAnimation = false;

	constructor({ scene, parts, scrollDOMSelector, sceneActions }){
		this.scene = scene;

		this.scrollDOM = document.querySelector(scrollDOMSelector);
		this.parts = parts;
		this.partHeight = this.scrollDOM.children[0].clientHeight;

		for(let i = 0; i < this.parts; i++){
			this.partOffsets.push(i * this.partHeight);
		}

		this.setupEventsForNavButtons();

		this.sceneActions = sceneActions || {};

		this.update(true);
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

	getDisplayedSceneIndex(){
		return this.displayedSceneIndex;
	}

	changeScene(e){
		if(this.isAnimation || this.isSceneAnimation)
			return;

		this.previousPartIndex = this.partIndex;
		this.partIndex = parseInt(e.target.dataset.sceneId);

		this.update();
	}

	update(firstTime=false){
		this.displayScene(firstTime);
		this.updateNavButtons();
		this.checkSceneActions();
	}

	checkSceneActions(){
		if(this.previousPartIndex == this.partIndex)
			return;

		let previousSceneActions = this.sceneActions[this.previousPartIndex];
		let currentSceneActions = this.sceneActions[this.partIndex];

		this.isSceneAnimation = true;
		let didEnterFinish = false;
		let didExitFinish = false;

		if(previousSceneActions != undefined && previousSceneActions.exit != undefined){
			this.displayedSceneIndex = this.previousPartIndex;
			previousSceneActions.exit()
				.then(() => {
					didExitFinish = true;
					this.changeSceneAnimationState(!(didEnterFinish && didExitFinish));
					this.displayedSceneIndex = this.partIndex;
				});
		} else {
			didExitFinish = true;
			this.displayedSceneIndex = this.partIndex;
		}

		if(currentSceneActions != undefined && currentSceneActions.enter != undefined)
			currentSceneActions.enter()
				.then(() => {
					didEnterFinish = true;
					this.changeSceneAnimationState(!(didEnterFinish && didExitFinish));
				});
		else
			didEnterFinish = true;

		this.changeSceneAnimationState(!(didEnterFinish && didExitFinish));
	}

	changeSceneAnimationState(state){
		this.isSceneAnimation = state;
	}

	updateNavButtons(){
		let buttons = document.querySelectorAll('.navigation button');

		for(let i = 0; i < buttons.length; i++){
			let state = i == this.partIndex;
			buttons[i].classList.toggle('activeButton', state);
		}
	}

	displayScene(withoutAnimation=false){
		for(let i = 1; i <= this.parts; i++){
			let sceneObjects = this.scene.getObjectByName(this.sceneNamePrefix + i, true);

			if(i != this.partIndex + 1){
				if(withoutAnimation)
					sceneObjects.visible = false;
				else if(sceneObjects.visible)
					this.setOpacityOfScene(sceneObjects, 1, 0);
			} else if(i == this.partIndex + 1){
				this.setOpacityOfScene(sceneObjects, 0, 1);
			}
		}
	}

	setOpacityOfScene(sceneObjects, fromOpacity, toOpacity, delay=200){
		new TWEEN.Tween({ opacity: fromOpacity })
		.to({ opacity: toOpacity }, delay)
		.easing(TWEEN.Easing.Linear.None)
		.onUpdate((tweenAttr) => {
			sceneObjects.traverse((obj) => {
				if(obj.material){
					obj.material.transparent = true;
					obj.material.opacity = tweenAttr.opacity;
				}
			})

			this.isAnimation = true;
		})
		.onStart(() => {
			sceneObjects.visible = fromOpacity > 0 || toOpacity != 0;

			this.isAnimation = true;
		})
		.onComplete(() => {
			sceneObjects.visible = toOpacity != 0;

			this.isAnimation = false;
		}).start();
	}
}
