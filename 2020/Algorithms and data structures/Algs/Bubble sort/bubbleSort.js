/**
 * Bubble sort algorithm:
 * Complexity: O(n²)
 * 
 * Description:
 * Goes through every element and checks if the element
 * is bigger than the next element, if so, swaps them
 * 
 * Colors:
 * Light blue   -> Unsorted
 * Blue         -> Sorted element
 * Light green  -> Sorted
 * Gray         -> Checked
 * 
 * Controls:
 * Sort                         -> Starts the algorithm
 * Reset                        -> Resets the values of the array
 * Speed of algorithm (Speed)   -> Updates the speed of the algorithm
 * Number of elements (Length)  -> Updates the amount of elements
 */

/**
 * The main algorithm
 * Sorts the array and visualizes the process
 */
async function sort(){
    if(running){
        return;
    }
    running = true;

    for(var i = 0; i < arr.length - 1; i++){
        
        for(var j = 0; j < arr.length - i - 1; j++){

            setChildColor(j, "Blue");
            setChildColor(j + 1, "Gray");
            await sleep(speed);

            if(arr[j] > arr[j + 1]){
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapEl(j, j + 1);
                await sleep(speed);
            }

            setChildColor(j, defaultColor);
            setChildColor(j + 1, defaultColor);
        }

        setChildColor(arr.length - i - 1, sortedColor);

    }
    setChildColor(0, sortedColor);

    running = false;
}