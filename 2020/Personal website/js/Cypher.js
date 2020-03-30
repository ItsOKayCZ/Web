class Cypher{

    str = "";
    current = "";
    font;
    size;

    offsetX = 0;
    offsetY = 0;

    index = 0;

    count = 0;
    maxCount = 2;

    backgroundColor;
    textColor;

    constructor(parameters){
        [this.font, this.str, this.size, this.textColor, this.backgroundColor] = parameters;
        this.font = font;
        textFont(this.font);

        for(var i = 0; i < this.str.length; i++){
            this.current += this.generateChar();
        }

        var bounds = this.font.textBounds(this.str, 0, 0, this.size);
        this.offsetX = bounds.w / 2;
        this.offsetY = bounds.h / 4;

    }

    update(){
        background(this.backgroundColor);

        fill(this.textColor);
        noStroke();
        textSize(this.size);
        text(this.current, width / 2 - this.offsetX, height / 2 + this.offsetY);

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

    generateChar(){
        return String.fromCharCode(floor(random(33, 123)))
    }
}