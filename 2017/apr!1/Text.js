function Text(){

	ctx.font = "90pt Bangers";

  this.text = {
    font: "Click me!",
    lineWidth: 4,
    size: parseInt(ctx.font),
		width: ctx.measureText(this.font).width,
		strokeColor: "Black",
    color: "#fdf316"
  };

  this.shadow = {
    color: "#4d002f",
    x: 7,
    y: 7
  };

  this.pos = {
    x: c.width / 2 - (this.text.width / 2),
    y: c.height / 2
  };

  this.reset = {
    shadow: {}
  };

  this.de = 0.9;

  this.mode = false;
  this.changeMode = 3;
  this.textMoved = 0;
  this.changed = false;
  this.textChanged = false;
  this.wSpam = 10;

  this.small = 0.2;

  this.renderText = function(){

    ctx.fillStyle = this.text.color;
    ctx.lineWidth = this.text.lineWidth;
		ctx.strokeStyle = this.text.strokeColor;

    ctx.fillText(this.text.font, this.pos.x, this.pos.y);
    ctx.strokeText(this.text.font, this.pos.x, this.pos.y);

  }

  this.onClick = function(){

		if(!isSpammed){

			if(this.textMoved <= this.wSpam){

	      if(Math.randomInt(1, 100) <= 10 || this.textMoved + 1 < this.wSpam){

	        if(!this.textChanged){

	          this.reset.textSize = this.text.size;
						this.reset.textWidth = this.text.width;
	          this.reset.lineWidth = this.text.lineWidth;
	          this.reset.shadow.x = this.shadow.x;
	          this.reset.shadow.y = this.shadow.y;

	          this.textChanged = true;
	        }

	        this.text.size *= this.small;
	        this.text.lineWidth *= this.small;
					this.text.width *= this.small;
	        this.shadow.x *= this.small;
	        this.shadow.y *= this.small;

	      } else {

	        if(this.textChanged){

	          this.text.size = this.reset.textSize;
						this.text.width = this.reset.textWidth;
	          this.text.lineWidth = this.reset.lineWidth;
	          this.shadow.x = this.reset.shadow.x;
	          this.shadow.y = this.reset.shadow.y;

	          this.textChanged = false;
	        }

	        this.text.size *= this.de;
	      	this.text.lineWidth *= this.de;
					this.text.width *= this.de;

	        this.shadow.x *= this.de;
	        this.shadow.y *= this.de;

	      }

	      this.pos = {
	        x: Math.randomInt(0, c.width - this.text.width),
	        y: Math.randomInt(0 + this.text.size, c.height)
	      };

	    	this.textMoved++;
	      this.changed = false;
				ctx.font = this.text.size.toString() + "pt Bangers";

	    } else {

				for(var i = 0; i < spamC; i++){

					texts[i] = new Text();

					texts[i].changeText({
						font: this.text.font,
						lineWidth: this.reset.lineWidth,
						size: this.reset.textSize,
						width: this.reset.textWidth,
						strokeColor: this.text.strokeColor,
						color: this.text.color
					});

					texts[i].changePos({
						x: Math.randomInt(0, c.width - texts[i].text.width),
						y: Math.randomInt(0 + texts[i].text.size, c.height)
					});

					isSpammed = true;

				}

			}

		} else {

			this.text.font = "April!";
			this.text.color = backgroundColor;
			this.text.strokeColor = backgroundColor;

			isTextChanged = true;

		}

  }

	this.changePos = function(pos){

		this.pos = pos;

	}

	this.changeText = function(text){

		this.text = text;

	}

  this.checkPos = function(pos){

		if(this.mode){

      if(pos.x >= this.pos.x && pos.x < this.pos.x + this.text.width){

        if(pos.y >= this.pos.y - this.text.size && pos.y <= this.pos.y){

          this.onClick();

        }

      }

    }

  }

  this.checkClick = function(pos){

		if(!this.mode || !isSpammed){

      if(pos.x >= this.pos.x && pos.x < this.pos.x + this.text.width){

        if(pos.y >= this.pos.y - this.text.size && pos.y <= this.pos.y){

          this.onClick();

        }

      }

    }

  }

  this.renderShadow = function(){

		if(!isSpammed){

			ctx.fillStyle = this.shadow.color;

	    ctx.fillText(this.text.font, this.pos.x + this.shadow.x, this.pos.y + this.shadow.y);

		}

  }

  this.render = function(){

    this.renderShadow();
    this.renderText();

  }

  this.update = function(){

		ctx.font = this.text.size.toString() + "pt Bangers";

    if(!this.changed){

      var digit = this.textMoved / 6;
    	digit = digit.toString().split(".")[1];
      if(digit == undefined){
        digit = [0];
      }
      if(digit[0] == 3){
        this.mode = !this.mode;
        this.changed = true;
      }

    }

    if(this.text.size <= 3){
      this.onClick();
    }

    this.render();

  }

}
