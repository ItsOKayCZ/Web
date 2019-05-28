var c,
    candle,
    backgroundColor = "#402D35",
    ctx;

window.onload = function(){

    // var ad = document.getElementsByTagName("div")[0];
    // ad.parentNode.removeChild(ad);

    c = document.getElementById("canvas");

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    ctx = c.getContext("2d");
    candle = new Candle();

    update();
};

function update(){

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, c.width, c.height);
    
    window.requestAnimationFrame(update);

    candle.update();

}