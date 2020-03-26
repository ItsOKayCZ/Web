var cypher;

window.onload = function(){
    cypher = new Cypher("Welcome to cypher");

    this.setInterval(update, 50);
}

function update(){
    cypher.update();
}

class Cypher{

    render;

    str = "";
    current = "";
    
    index = 0;
    count = 0;
    maxCount = 3;

    constructor(str=""){
        this.str = str;

        this.render = new Render();

        for(var i = 0; i < this.str.length; i++){
            this.current += this.generateChar();
        }
    }

    update(){
        this.render.clear();

        this.render.setFont("sans-serif", "7em");
        this.render.text(this.render.c.width / 2, 
                         this.render.c.height / 2 + 25, this.current, "fill", "center", this.str);

        
        this.current = this.str.substr(0, this.index + 1);

        for(var i = this.index; i < this.str.length - 1; i++){
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
        return String.fromCharCode(generateNumber(33, 123))
    }
}