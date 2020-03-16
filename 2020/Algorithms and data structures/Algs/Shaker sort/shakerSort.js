/**
 * TODO: Description
 */

/**
 * The main algorithm
 * Sorts the array and visualizes the process
 */
async function sort(){
    if(running){
        return;
    }

    for(var i = 0; i < arr.length / 2; i++){

        var swapped = false;

        for(var j = i; j < arr.length - i - 1; j++){
            setChildColor(j, "blue");
            setChildColor(j + 1, "gray");
            await sleep(speed);

            if(arr[j] > arr[j + 1]){
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
                
                swapEl(j, j + 1);
                await sleep(speed);
            }

            setChildColor(j, defaultColor);
            setChildColor(j + 1, defaultColor);
        }

        setChildColor(arr.length - i - 1, sortedColor);

        for(var j = arr.length - 2 - i; j > i; j--){
            setChildColor(j, "blue");
            setChildColor(j - 1, "gray");
            await sleep(speed);

            if(arr[j] < arr[j - 1]){
                [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
                swapped = true;

                swapEl(j, j - 1);
                await sleep(speed);
            }

            setChildColor(j, defaultColor);
            setChildColor(j - 1, defaultColor);
        }

        setChildColor(i, sortedColor);

        if(!swapped){
            for(var i = 0; i < arr.length; i++){
                setChildColor(i, sortedColor);
            }

            break;
        }

    }

    running = true;
}