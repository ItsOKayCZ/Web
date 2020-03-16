/**
 * Insertion sort algorithm
 * Complexity: O(n²)
 * 
 * Description:
 * Takes the highest element in the unsorted part of the array
 * and inserts it as first of the unsorted part of the array
 * 
 * Colors:
 * Light blue   -> Unsorted
 * Blue         -> el1
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
        var index = i;

        for(var j = i + 1; j < arr.length; j++){
            setChildColor(index, "Blue");
            setChildColor(j, "Gray");
            await sleep(speed);
            if(arr[j] < arr[index]){
                setChildColor(index, defaultColor);
                index = j;
            }
            setChildColor(j, defaultColor);
        }
        
        var temp = arr[i];
        arr[i] = arr[index];
        arr[index] = temp;
        swapEl(i, index);

        setChildColor(i, sortedColor);
    }

    setChildColor(arr.length - 1, sortedColor);

    running = false;
}