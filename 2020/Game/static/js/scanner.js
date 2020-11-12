var mainWindow = window.opener;

var c;
var ctx;
window.onload = (e) => {
    c = $('#canvas').get(0);
    ctx = c.getContext('2d');

    c.width = 500;
    c.height = 500;

    update();
}

function update(){
    requestAnimationFrame(update);

    var x = mainWindow.screenLeft - window.screenLeft;
    var y = mainWindow.screenTop - window.screenTop;
    y += window.screen.height - window.screen.availHeight;
    console.log(y);

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    ctx.rect(x, y, mainWindow.innerWidth, mainWindow.innerHeight);
    ctx.stroke();
    ctx.fill();
}