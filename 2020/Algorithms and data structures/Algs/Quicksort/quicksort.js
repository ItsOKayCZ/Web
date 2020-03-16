/**
 * Quicksort algorithm
 * Complexity: O(n.logn) - O(n²)
 * 
 * Description:
 * TODO
 * 
 * Colors:
 * TODO
 * 
 * Controls:
 * Sort                         -> Starts the algorithm
 * Reset                        -> Resets the values of the array
 * Speed of algorithm (Speed)   -> Updates the speed of the algorithm
 * Number of elements (Length)  -> Updates the amount of elements
 */

var lowerValueColor = "#ffcb64";

/**
 * The main algorithm
 * Sorts the array and visualizes the process
 */
async function sort(){
    if(running){
        return;
    }
    running = true;

    // Need for recursion
    async function quicksort(arr, left, right){
        if(left < right){
            boundary = left;
            for(var i = left + 1; i < right; i++){
                console.log("1");
                setOutline(left, right - 1, "red", 3);
            
                setChildColor(i, "Blue");
                await sleep(speed);
                if(arr[i] < arr[left]){
                    resetBorder(i);
                    setChildColor(i, lowerValueColor);
                    swap(arr, i, ++boundary);
                    swapEl(i, boundary);

                    console.log("2");
                    setOutline(left, right - 1, "red", 3);
                } else {
                    setChildColor(i, defaultColor);
                }
            }

            setOutline(left, right - 1, "black", 1);

            setChildColor(left, sortedColor);
            swap(arr, left, boundary);
            swapEl(left, boundary);
            await quicksort(arr, left, boundary);
            await quicksort(arr, boundary + 1, right);
        }
    }
    await quicksort(arr, 0, arr.length);

    running = false;
}

function swap(arr, left, right){
    var temp = arr[right];
    arr[right] = arr[left];
    arr[left] = temp;
}