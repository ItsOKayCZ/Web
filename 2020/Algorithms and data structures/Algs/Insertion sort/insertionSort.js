/**
 * Insertion sort algorithm
 * Complexity: O(n) - O(n²)
 * 
 * Description:
 * Loops through the whole array and checks at every element (el1)
 * if any of the previous elements is higher, if so, than el1 is 
 * inserted after it
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
    
    var pos;
    var val;

    for(var i = 0; i < arr.length; i++){
        val = arr[i];
        pos = i;

        setChildColor(i, "Blue");
        await sleep(speed);
        while(pos > 0 && arr[pos - 1] > val){
            setChildColor(pos - 1, "Gray");
            await sleep(speed);
            arr[pos] = arr[pos - 1];
            pos = pos - 1;
            setChildColor(pos, defaultColor);
        }
        
        setChildColor(i, defaultColor);
        moveEl(i, pos);
        arr[pos] = val;
    }

    for(var i = 0; i < arr.length; i++){
        setChildColor(i, sortedColor);
        await sleep(50);
    }

    running = false;
}