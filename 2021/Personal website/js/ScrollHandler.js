class ScrollHandler{
	DOM;
	htmlDOM;
	bodyDOM;

	parts;
	partSize = 100;
	partIndex = 0;
	transition = false;

	currentScroll = 0;

	easeFunction;
	delay = 10;

	constructor({ DOMSelector, parts, easeFunction }){
		console.log('Created scroll handler');

		this.DOM = document.querySelector(DOMSelector);
		this.htmlDOM = document.querySelector('html');
		this.bodyDOM = document.querySelector('body');

		this.parts = parts;
		this.DOM.style.height = `${this.parts * this.partSize}%`;

		this.bodyDOM.scrollTop = 0;
		this.bodyDOM.onscroll = (e) => this.scroll(e);

		this.easeFunction = easeFunction != undefined ? easeFunction : EasingFunctions.linear;
	}

	scroll(e){
		if(this.transition){
			this.htmlDOM.scrollTop = this.currentScroll;
			return;
		}

		let changeScroll = this.htmlDOM.scrollTop;

		if(this.currentScroll < changeScroll){
			this.nextPart();
		} else if(this.currentScroll > changeScroll){
			// this.previousPart();
		}
	}

	async nextPart(){
		console.log('Going to next part');
		this.transition = true;
		let partHeight = window.innerHeight;
		let originScroll = this.currentScroll;

		let maxScroll = partHeight * this.parts;

		// TODO: Not working
		for(let i = 0; i < 1; i += 0.1){
			await sleep(this.delay);
			let easeAmount = this.easeFunction(i);
			this.currentScroll = originScroll + partHeight * easeAmount;
			if(this.currentScroll > maxScroll)
				this.currentScroll = maxScroll;
			this.htmlDOM.scrollTop = this.currentScroll;
		}

		this.transition = false;
	}

	previousPart(){
		console.log('Going to previous part');
		this.transition = true;
		let partHeight = window.innerHeight;
		let originScroll = this.currentScroll;

		for(let i = 0; i < 1; i += 0.1){
			let easeAmount = this.easeFunction(i);
			this.currentScroll = originScroll - partHeight * easeAmount;
			this.htmlDOM.scrollTop = this.currentScroll;
		}

		this.transition = false;
	}
}
