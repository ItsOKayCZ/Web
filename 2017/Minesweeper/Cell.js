function Cell(i, j, bomb){

	this.coor = Math.createVector(i, j);
	this.pos = Math.createVector(i * cellWidth, j * cellWidth);
	this.bomb = bomb;
	this.clicked = false;
	this.img = new Image();
	this.img.src = "Bomb.png";
	this.flagImg = new Image();
	this.flagImg.src = "Flag.png";
	this.flagImg.offset = 5;
	this.bombC = 0;
	this.clickedColor = {
		outLine: "#a7a6a6",
		inLine: "#d2d2d2",
		outLineWidth: 20
	};
	this.flagged = false;

	this.calcBombs = function(){

		var left = false;
		var right = false;
		var up = false;
		var down = false;

		if(this.coor.x - 1 >= 0){
			left = true;
			if(cells[this.coor.x - 1][this.coor.y].bomb){
				this.bombC += 1;
			}
		}

		if(this.coor.x + 1 <= cells.length - 1){
			right = true;
			if(cells[this.coor.x + 1][this.coor.y].bomb){
				this.bombC += 1;
			}
		}

		if(this.coor.y - 1 >= 0){
			up = true;
			if(cells[this.coor.x][this.coor.y - 1].bomb){
				this.bombC += 1;
			}
		}

		if(this.coor.y + 1 <= cells[this.coor.x].length - 1){
			down = true;
			if(cells[this.coor.x][this.coor.y + 1].bomb){
				this.bombC += 1;
			}
		}

		if(left && up){
			if(cells[this.coor.x - 1][this.coor.y - 1].bomb){
				this.bombC += 1;
			}
		}

		if(left && down){
			if(cells[this.coor.x - 1][this.coor.y + 1].bomb){
				this.bombC += 1;
			}
		}

		if(right && up){
			if(cells[this.coor.x + 1][this.coor.y - 1].bomb){
				this.bombC += 1;
			}
		}

		if(right && down){
			if(cells[this.coor.x + 1][this.coor.y + 1].bomb){
				this.bombC += 1;
			}
		}
	}

	this.onClick = function(mousePos){

		if(!gameOver){

			if(!mousePos.flag){

				if((mousePos.x > this.pos.x)
				&& (mousePos.x < this.pos.x + cellWidth)
				&& (mousePos.y > this.pos.y)
				&& (mousePos.y < this.pos.y + cellWidth)){

					this.show();

				}

			} else {

				if((mousePos.x > this.pos.x)
				&& (mousePos.x < this.pos.x + cellWidth)
				&& (mousePos.y > this.pos.y)
				&& (mousePos.y < this.pos.y + cellWidth)){

					this.flagIt();

				}

			}

		}

	}

	this.showNoBombs = function(){

		this.clicked = true;

		var right = false;
		var left = false;
		var up = false;
		var down = false;

		var leftCell;
		var rightCell
		var downCell;
		var upCell;
		var leftUpCell;
		var leftDownCell;
		var rightUpCell;
		var rightDownCell;

		if(this.coor.x - 1 >= 0){
			left = true;
			leftCell = cells[this.coor.x - 1][this.coor.y];
		}
		if(this.coor.x + 1 <= cells.length - 1){
			right = true;
			rightCell = cells[this.coor.x + 1][this.coor.y];
		}
		if(this.coor.y - 1 >= 0){
			up = true;
			upCell = cells[this.coor.x][this.coor.y - 1];
		}
		if(this.coor.y + 1 <= cells[this.coor.x].length - 1){
			down = true;
			downCell = cells[this.coor.x][this.coor.y + 1];
		}
		if(left && up){
			leftUpCell = cells[this.coor.x - 1][this.coor.y - 1];
		}
		if(left && down){
			leftDownCell = cells[this.coor.x - 1][this.coor.y + 1];
		}
		if(right && up){
			rightUpCell = cells[this.coor.x + 1][this.coor.y - 1];
		}
		if(right && down){
			rightDownCell = cells[this.coor.x + 1][this.coor.y + 1];
		}

		if(leftCell != undefined){
			if(!leftCell.bomb){
				if(leftCell.bombC == 0){
					if(!leftCell.clicked){
						leftCell.showNoBombs();
					}
				} else {
					leftCell.clicked = true;
				}
			}
		}
		
		if(rightCell != undefined){
			if(!rightCell.bomb){
				if(rightCell.bombC == 0){
					if(!rightCell.clicked){
						rightCell.showNoBombs();
					}
				} else {
					rightCell.clicked = true;
				}
			}
		}

		if(upCell != undefined){
			if(!upCell.bomb){
				if(upCell.bombC == 0){
					if(!upCell.clicked){
						upCell.showNoBombs();
					}
				} else {
					upCell.clicked = true;
				}
			}
		}

		if(downCell != undefined){
			if(!downCell.bomb){
				if(downCell.bombC == 0){
					if(!downCell.clicked){
						downCell.showNoBombs();
					}
				} else {
					downCell.clicked = true;
				}
			}
		}

		if(leftUpCell != undefined){
			if(!leftUpCell.bomb){
				if(leftUpCell.bombC == 0){
					if(!leftUpCell.clicked){
						leftUpCell.showNoBombs();
					}
				} else {
					leftUpCell.clicked = true;
				}
			}
		}

		if(leftDownCell != undefined){
			if(!leftDownCell.bomb){
				if(leftDownCell.bombC == 0){
					if(!leftDownCell.clicked){
						leftDownCell.showNoBombs();
					}
				} else {
					leftDownCell.clicked = true;
				}
			}
		}

		if(rightUpCell != undefined){
			if(!rightUpCell.bomb){
				if(rightUpCell.bombC == 0){
					if(!rightUpCell.clicked){
						rightUpCell.showNoBombs();
					}
				} else {
					rightUpCell.clicked = true;
				}
			}
		}

		if(rightDownCell != undefined){
			if(!rightDownCell.bomb){
				if(rightDownCell.bombC == 0){
					if(!rightDownCell.clicked){
						rightDownCell.showNoBombs();
					}
				} else {
					rightDownCell.clicked = true;
				}
			}
		}
	}

	this.flagIt = function(){
		this.flagged = !this.flagged;
	}

	this.show = function(){

		if(this.bomb){
			gameOver = true;
		}

		if(!this.bomb && this.bombC == 0){
			this.showNoBombs();
		}

		this.clicked = true;
	}

	this.render = function(){

		ctx.strokeStyle = "Black";
		ctx.beginPath();
		ctx.rect(this.pos.x, this.pos.y, cellWidth, cellWidth);
		ctx.stroke();
		
		if(this.clicked && !gameOver){
			
			ctx.fillStyle = this.clickedColor.outLine;
			ctx.fillRect(this.pos.x + ctx.lineWidth, this.pos.y + ctx.lineWidth, cellWidth - ctx.lineWidth, cellWidth - ctx.lineWidth);
			
			var pos = {
				x: this.pos.x + this.clickedColor.outLineWidth,
				y: this.pos.y + this.clickedColor.outLineWidth
			};
			var posWidth = {
				x: cellWidth - this.clickedColor.outLineWidth * 2,
				y: cellWidth - this.clickedColor.outLineWidth * 2
			};
			ctx.fillStyle = this.clickedColor.inLine;
			ctx.fillRect(pos.x, pos.y, posWidth.x, posWidth.y);

			if(this.bombC != 0){
				pos = {
					x: this.pos.x + cellWidth / 2 - ctx.measureText(this.bombC.toString()).width / 2,
					y: this.pos.y + cellWidth / 2 + 10
				};
				ctx.fillStyle = "Black";
				ctx.fillText(this.bombC.toString(), pos.x, pos.y);
			}
		}

		if(this.clicked && this.bomb){
			ctx.drawImage(this.img, this.pos.x, this.pos.y, cellWidth, cellWidth);
		} else if(gameOver && this.bomb){
			ctx.drawImage(this.img, this.pos.x, this.pos.y, cellWidth, cellWidth);
		}

		if(this.flagged){
			if(!gameOver){
				if(!won){
					if(!this.clicked){
						ctx.drawImage(this.flagImg, this.pos.x + this.flagImg.offset, this.pos.y + this.flagImg.offset, cellWidth - this.flagImg.offset, cellWidth - this.flagImg.offset);
					}
				}
			}
		}

		if(won && this.bomb){
			ctx.drawImage(this.img, this.pos.x, this.pos.y, cellWidth, cellWidth);
		}

	}

	this.update = function(){

		this.render();

		if(this.bombC == 0){
			this.calcBombs();
		}

	}

}
