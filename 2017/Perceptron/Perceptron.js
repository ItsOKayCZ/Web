function Perceptron(){

	this.w = [undefined, undefined];
	for(var i = 0; i < this.w.length; i++){
		this.w[i] = Math.randomFloat(-1, 1);
	}

}