/**
 * TODO: Description
 * 
 * TODO:
 * Make visualizing
 */

/**
 * The main algorithm
 * Sorts the array and visualizes the process
 */
async function sort(){
    if(running){
        return;
    }

    console.log(arr);

    function heapify(arr, length, i){
        var largest = i;
        var left = i * 2 + 1;
        var right = left + 1;

        if(left < length && arr[left] > arr[largest]){
            largest = left;
        }

        if(right < length && arr[right] > arr[largest]){
            largest = right;
        }

        if(largest != i){
            [arr[i], arr[largest]] = [arr[largest], arr[i]];

            heapify(arr, length, largest);
        }

        return arr;
    }

    function heapSort(arr){
        var length = arr.length;    
        var i = Math.floor(length / 2 - 1);
        var k = length - 1;

        while(i >= 0){
            heapify(arr, length, i);
            i--;
        }

        while(k >= 0){
            [arr[0], arr[k]] = [arr[k], arr[0]];
            heapify(arr, k, 0);
            k--;
        }

        return arr;
    }

    arr = heapSort(arr);


    console.log(arr);

    running = true;
}