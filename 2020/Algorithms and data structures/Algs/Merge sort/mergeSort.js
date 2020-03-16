/**
 * Merge sort algorithm
 * Complexity: O(n.logn)
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

/**
 * The main algorithm
 * Sorts the array and visualizes the process
 */
async function sort(){
    if(running){
        return;
    }
    running = true;

    async function mergeSort(arr, aux, left, right){
        
        if(left == right) return;

        var middleIndex = Math.floor((left + right) / 2);

        await mergeSort(arr, aux, left, middleIndex);
        await mergeSort(arr, aux, middleIndex + 1, right);
        await merge(arr, aux, left, right);

        for(var i = 0; i <= right; i++){
            arr[i] = aux[i];
        }
    }

    async function merge(arr, aux, left, right){
        
        var middleIndex = Math.floor((left + right) / 2);
        var leftIndex = left;
        var leftIndexGraph = left;
        var rightIndex = middleIndex + 1;

        var auxIndex = left;

        while(leftIndex <= middleIndex && rightIndex <= right){

            leftIndexGraph = left + (auxIndex - left);

            setOutline(leftIndexGraph, rightIndex - 1, "red", 5);
            setOutline(rightIndex, right, "red", 5);

            setChildColor(leftIndexGraph, "yellow");
            setChildColor(rightIndex, "yellow");
            await sleep(speed);

            if(arr[leftIndex] <= arr[rightIndex]){

                setChildColor(leftIndexGraph, "gray");
                await sleep(speed);
                resetBorder(leftIndexGraph);
                setChildColor(leftIndexGraph, defaultColor);

                aux[auxIndex] = arr[leftIndex];

                leftIndex++;
            } else {
                aux[auxIndex] = arr[rightIndex];

                setChildColor(rightIndex, "gray");
                await sleep(speed);
                resetBorder(rightIndex);
                setChildColor(rightIndex, defaultColor);
                moveEl(rightIndex, auxIndex);

                rightIndex++;
            }

            setChildColor(auxIndex, defaultColor);
            resetBorder(auxIndex);
            auxIndex++;
        }

        await sleep(speed);

        while(leftIndex <= middleIndex){
            aux[auxIndex] = arr[leftIndex];

            setChildColor(auxIndex, "gray");
            await sleep(speed);
            setChildColor(auxIndex, defaultColor);
            
            if(leftIndex + 1 <= middleIndex){
                setOutline(auxIndex + 1, middleIndex, "red", 5);
            }
            resetBorder(auxIndex);

            leftIndex++;
            auxIndex++;
        }
        while(rightIndex <= right){
            aux[auxIndex] = arr[rightIndex];

            setChildColor(rightIndex, "gray");
            await sleep(speed);
            setChildColor(rightIndex, defaultColor);

            if(rightIndex + 1 <= right){
                setOutline(rightIndex + 1, right, "red", 5);
            }
            resetBorder(rightIndex);

            moveEl(rightIndex, auxIndex);

            rightIndex++;
            auxIndex++;
        }

        resetBorder(left);
        setChildColor(left, defaultColor);
        resetBorder(leftIndex);
        setChildColor(leftIndex, defaultColor);
        resetBorder(leftIndexGraph);
        setChildColor(leftIndexGraph, defaultColor);
        resetBorder(right);
        setChildColor(right, defaultColor);
        resetBorder(rightIndex - 1);
        setChildColor(rightIndex - 1, defaultColor);
        resetBorder(middleIndex);
        setChildColor(middleIndex, defaultColor);
        resetBorder(middleIndex + 1);
        setChildColor(middleIndex + 1, defaultColor);
    }
    
    await mergeSort(arr, [], 0, arr.length - 1);

    for(var i = 0; i < arr.length; i++){
        await sleep(50);
        setChildColor(i, sortedColor);
    }

    running = false;
}
