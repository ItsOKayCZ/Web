const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

camera.position.z = 17;
camera.position.y = 24;
camera.position.x = 16;
camera.rotation.x = -1;

var cubeAmountWidth = 35;
var cubeAmountHeight = 7;
var cubeWidth = 0.8;
var cubes = [];
var spacing = 1.1;

var message = [
    // W
    {x: 0, y: 0},
    {x: 0, y: 1},
    {x: 0, y: 2},
    {x: 0, y: 3},
    {x: 0, y: 4},
    {x: 0, y: 5},
    {x: 1, y: 6},
    {x: 2, y: 5},
    {x: 2, y: 4},
    {x: 2, y: 3},
    {x: 2, y: 2},
    {x: 3, y: 6},
    {x: 4, y: 0},
    {x: 4, y: 1},
    {x: 4, y: 2},
    {x: 4, y: 3},
    {x: 4, y: 4},
    {x: 4, y: 5},

    // e
    {x: 6, y: 2},
    {x: 6, y: 3},
    {x: 6, y: 4},
    {x: 6, y: 5},
    {x: 7, y: 1},
    {x: 7, y: 4},
    {x: 7, y: 6},
    {x: 8, y: 1},
    {x: 8, y: 4},
    {x: 8, y: 6},
    {x: 9, y: 2},
    {x: 9, y: 3},
    {x: 9, y: 4},

    // l
    {x: 11, y: 0},
    {x: 12, y: 0},
    {x: 12, y: 1},
    {x: 12, y: 2},
    {x: 12, y: 3},
    {x: 12, y: 4},
    {x: 12, y: 5},
    {x: 13, y: 6},
    
    // c
    {x: 15, y: 2},
    {x: 15, y: 3},
    {x: 15, y: 4},
    {x: 15, y: 5},
    {x: 16, y: 1},
    {x: 16, y: 6},
    {x: 17, y: 1},
    {x: 17, y: 6},
    {x: 18, y: 2},
    {x: 18, y: 5},

    // o
    {x: 20, y: 2},
    {x: 20, y: 3},
    {x: 20, y: 4},
    {x: 20, y: 5},
    {x: 21, y: 1},
    {x: 21, y: 6},
    {x: 22, y: 1},
    {x: 22, y: 6},
    {x: 23, y: 2},
    {x: 23, y: 3},
    {x: 23, y: 4},
    {x: 23, y: 5},

    // m
    {x: 25, y: 2},
    {x: 25, y: 3},
    {x: 25, y: 4},
    {x: 25, y: 5},
    {x: 25, y: 6},
    {x: 26, y: 1},
    {x: 27, y: 2},
    {x: 27, y: 3},
    {x: 27, y: 4},
    {x: 27, y: 5},
    {x: 27, y: 6},
    {x: 28, y: 1},
    {x: 29, y: 2},
    {x: 29, y: 3},
    {x: 29, y: 4},
    {x: 29, y: 5},
    {x: 29, y: 6},

    // e
    {x: 31, y: 2},
    {x: 31, y: 3},
    {x: 31, y: 4},
    {x: 31, y: 5},
    {x: 32, y: 1},
    {x: 32, y: 4},
    {x: 32, y: 6},
    {x: 33, y: 1},
    {x: 33, y: 4},
    {x: 33, y: 6},
    {x: 34, y: 2},
    {x: 34, y: 3},
    {x: 34, y: 4},
];

for(var i = 0; i < cubeAmountWidth; i++){
    cubes.push([]);
    for(var j = 0; j < cubeAmountHeight; j++){
        var geometry = new THREE.BoxGeometry(cubeWidth, cubeWidth, cubeWidth);
        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1,
        });
        var cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        var geo = new THREE.EdgesGeometry(cube.geometry);
        var mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2});
        var wireframe = new THREE.LineSegments(geo, mat);
        cube.add(wireframe);

        cube.position.x = i * spacing;
        cube.position.z = j * spacing;

        cubes[i].push(cube);
    }
}

var height = 1.2;
var index = 0;
function render(){
    for(var i = 0; i < cubes.length; i++){
        for(var j = 0; j < cubes[i].length; j++){

            // var count = index - (i - j) * 0.5;
            var count = index - i * 0.4;
            count = Math.sin(count);

            // var INDEX = index;
            // var INDEX = Math.sin(index) * height;
            // var I = INDEX * (i - cubeAmountWidth / 2);
            // var J = INDEX * (j - cubeAmountHeight / 2);
            // var count = Math.sin(Math.sqrt(I**2 + J**2));

            var colorOffset = 0.5;

            cubes[i][j].position.y = count * height;
            cubes[i][j].material.color.b = cubes[i][j].position.y - colorOffset;
            cubes[i][j].material.color.r = cubes[i][j].position.y - colorOffset;
            cubes[i][j].material.color.g = cubes[i][j].position.y - colorOffset;
            cubes[i][j].material.opacity = cubes[i][j].position.y;
            cubes[i][j].material.transparent = true;

            cubes[i][j].children[0].material.transparent = true;
            cubes[i][j].children[0].material.opacity = cubes[i][j].position.y;

            if(findCoords(i, j)){
                cubes[i][j].material.opacity = 1;
                cubes[i][j].children[0].material.opacity = 1;
                cubes[i][j].material.color.r = 0;
                cubes[i][j].material.color.g = 1;
                cubes[i][j].material.color.b = 0;
            }
        }
    }
    index += 0.018;

    // for(var i = 0; i < message.length; i++){
    //     var cube = cubes[message[i].x][message[i].y];
    //     cube.position.y = height * 2;
    //     cube.material.color.r = cube.position.y;
    //     cube.material.color.g = cube.position.y;
    //     cube.material.color.b = 0;
    // }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();

function findCoords(x, y){
    for(var i = 0; i < message.length; i++){
        if(message[i].x == x && message[i].y == y){
            return true;
        }
    }
    return false;
}

function degToRad(deg){
    return deg * (Math.PI / 180);
}
