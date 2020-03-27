class Cypher{

    str = "";
    current = "";
    font;
    size;

    offset = 0;

    index = 0;

    count = 0;
    maxCount = 2;

    constructor(font, str="", size=72){
        this.font = font;
        textFont(this.font);


        this.str = str;
        this.size = size;

        for(var i = 0; i < this.str.length; i++){
            this.current += this.generateChar();
        }

        this.offset = this.font.textBounds(this.str, 0, 0, this.size).w / 2;

    }

    update(){
        background(255);

        fill(0);
        noStroke();
        textSize(this.size);
        text(this.current, width / 2 - this.offset, height / 2);

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