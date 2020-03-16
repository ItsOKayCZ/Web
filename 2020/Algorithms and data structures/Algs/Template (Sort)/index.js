/**
 * TODO: Description
 * 
 * TODO:
 * Make a help menu
 * Change the ratio according to the display
 */

// Array properties
var arr = [];
var initLength = 10;
var running = false;

var speed = 500;
var defaultColor = "#93b0ff";
var sortedColor = "#9fff15";
var ratio = 40;

var parent; // Contents of the array elements displayed in html
var menu; // Menu class

/**
 * Generates an array and displays the array
 */
function init(){
    parent = document.getElementById("content");

    menu = new Controls([
        {
            label: "Sort",
            type: "button",
            onclick: sort
        },
        {
            label: "Reset",
            type: "button",
            onclick: reset
        },
        {
            label: "Speed",
            type: "slider",
            range: {
                min: 1,
                max: 1000
            },
            defaultValue: 500,
            oninput: changeSpeed
        },
        {
            label: "Length",
            type: "slider",
            range: {
                min: 2,
                max: 20
            },
            defaultValue: initLength,
            oninput: reset,
            showValue: true
        }
    ]);

    initArr();
}

/**
 * TODO
 */
function initArr(){
    arr = [];

    for(var i = 0; i < initLength; i++){
        arr.push(i + 1);
    }

    shuffle(arr);
    displayArrElements();
}

/**
 * Displays the contents of the array
 */
function displayArrElements(){
    parent.innerHTML = "";
    for(var i = 0; i < initLength; i++){
        parent.appendChild(createElement(arr[i]));
    }
}

/**
 * Displays the current value of the length slider
 */
function updateLength(){
    initLength = menu.getValue("Length");
}

/**
 * Changes the speed of the algorithm
 */
function changeSpeed(){
    speed = menu.getValue("Speed");
}

/**
 * Reset
 */
function reset(){
    if(running){
        menu.setValue("Length", initLength);
        return;
    }
    
    updateLength();
    initArr();
}

/**
 * Creates a DOM element and returns it
 */
function createElement(str){
    var el = document.createElement("div");
    el.classList = "element";
    el.innerHTML = str;

    el.style.height = parseInt(str) * ratio;

    return el;
}

/**
 * Sets a color to a DOM
 */
function setChildColor(index, color){
    parent.children[index].style.backgroundColor = color;
}

/**
 * TODO
 * @param {*} index1 
 * @param {*} index2 
 * @param {*} color 
 * @param {*} width 
 */
function setOutline(index1, index2, color, width){
    parent.children[index1].style.borderLeftColor = color;
    parent.children[index1].style.borderLeftWidth = width + "px";

    parent.children[index2].style.borderRightColor = color;
    parent.children[index2].style.borderRightWidth = width + "px";
}

/**
 * TODO
 */
function setRightMargin(index, width){
    parent.children[index].style.marginRight = width + "px";
}

/**
 * TODO
 * @param {*} index 
 */
function resetBorder(index){
    parent.children[index].style.borderRightColor = "black";
    parent.children[index].style.borderRightWidth = "1px";

    parent.children[index].style.borderLeftColor = "black";
    parent.children[index].style.borderLeftWidth = "1px";
}

/**
 * Swaps 2 elements from parent to a position specified
 */
function swapEl(index1, index2){
    var child1 = parent.children[index1];
    var child2 = parent.children[index2];

    var temp = document.createElement("div");
    parent.appendChild(temp);

    parent.insertBefore(temp, child2);
    parent.insertBefore(child2, child1);
    parent.insertBefore(child1, temp);

    temp.remove();
}

/**
 * Moves an element from parent to a position specified
 */
function moveEl(index1, index2){
    var child1 = parent.children[index1];
    var child2 = parent.children[index2];

    parent.insertBefore(child1, child2);
}