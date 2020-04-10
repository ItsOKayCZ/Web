class Cypher{

    constructor(parameters){
		this.current = '';
		this.offsetX = 0;
		this.offsetY = 0;
		this.index = 0;
		this.count = 0;
		this.maxCount = 2;

        [this.font, this.str, this.fontSize, this.textColor, this.backgroundColor, this.padding, this.userOffset] = parameters;
        textFont(this.font);

        for(var i = 0; i < this.str.length; i++){
            this.current += this.generateChar();
        }

		this.updateSize(this.fontSize);
    }

	getHeight(){
		return this.bounds.h;
	}

    update(){
        background(this.backgroundColor);

        fill(this.textColor);
        noStroke();
        textSize(this.fontSize);
		text(this.current, windowWidth / 2 - this.offsetX, (this.bounds.h + this.padding) / 2 + this.offsetY + this.userOffset); // TODO: Not working on projects.html

        this.current = this.str.substring(0, this.index + 1);

        for(var i = this.index; i < this.str.length; i++){
            this.current += this.generateChar();
        }

        if(this.count >= this.maxCount){
            this.index++;
            this.count = 0;
        } else {
            this.count++;
        }
    }

	updateSize(size){
		this.fontSize = size;
		this.bounds = this.font.textBounds(this.str, 0, 0, this.fontSize);
		this.offsetX = this.bounds.w / 2;
		this.offsetY = this.bounds.h / 2;
	}

    generateChar(){
        return String.fromCharCode(floor(random(33, 123)))
    }
}
