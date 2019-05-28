function Cell(col, row){

	this.coor = Math.createVector(col, row);
	this.pos = Math.createVector(col * cellHeight, row * cellHeight);

	this.color = "White";

	this.render = function(){

		ctx.strokeStyle = "Black";
		ctx.fillStyle = this.color;

		ctx.fillRect(this.pos.x, this.pos.y, cellHeight, cellHeight);

	}

	this.update = function(){

		var whiteCells = 0;

		if(cells[this.coor.x - 1] != undefined){
			if(cells[this.coor.x - 1][this.coor.y].color == "White"){
				whiteCells++;
			}
		}

		if(cells[this.coor.x][this.coor.y - 1] != undefined){
			if(cells[this.coor.x][this.coor.y - 1].color == "White"){
				whiteCells++;
			}
		}

		if(whiteCells == 1){
			this.color = "Black";
		}

	}

}