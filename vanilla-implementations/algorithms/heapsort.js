function heapSort(array) {
    // Create max heap
    createMaxHeap(array);
  
    // Find last element.
    lastNumber = array.length - 1;
  
    // Heap sort until just one element left in the array.
    while(lastNumber > 0) {
      swap(array, 0, lastNumber);
  
      heapify(array, 0, lastNumber);
  
      lastNumber -= 1
    }
  }

  function createMaxHeap(array) {
    var i;
    i = array.length / 2 - 1;
    i = Math.floor(i);
  
    // Create a max heap of array elements
    while (i >= 0) {
      heapify(array, i, array.length);
      i -= 1;
    }
  }
 


  function heapify(heap, i, max) {
    var index, leftChild, rightChild;
    
    while(i < max) {
      index = i;
  
      leftChild = 2 * i + 1;
      rightChild = leftChild + 1;
  
      if (leftChild < max && heap[leftChild] > heap[index]) {
        index = leftChild;
      }
  
      if (rightChild < max && heap[rightChild] > heap[index]) {
        index = rightChild;
      }
        
      if (index == i) {
        return;
      }
  
      swap(heap,i, index);
      
      i = index;
    }
  }

  function swap(array, firstNumber, lastNumber) {
    var temp = array[firstNumber];
       
    // Swap first and last elements in the array.
    array[firstNumber] = array[lastNumber];
    array[lastNumber] = temp;
  }

                  /*     CONSOLE TEST    */

    var testArray = [2, 89, 4, 3, 34, 22, 40, 1, 15, 78, 25];

  heapSort(testArray);

  console.log(testArray);