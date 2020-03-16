// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function genRandomNumber(max){
    return Math.floor(Math.random()* Math.floor(max - 1)) + 1;
}

// Source: https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Source: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

// Source: https://stackoverflow.com/questions/39776819/function-to-normalize-any-number-from-0-1
function normalize(val, max, min) { 
    return (val - min) / (max - min); 
}

// Source: https://www.w3resource.com/javascript-exercises/javascript-math-exercise-33.php
function degToRad(degrees){
    return degrees * (Math.PI/180);
}