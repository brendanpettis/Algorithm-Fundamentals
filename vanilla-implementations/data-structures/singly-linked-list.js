
/* 
  What is a Linked List?

- Consists of a bunch of elements with no indexes, who are just pointing to the next element.
- Like a bunch of train cars connected to eachother.
- Contains a head, tail, and length.
- Consists of nodes, each node has a value, and a pointer to another node or null.
- Nodes store a piece of data ex. string, number, etc. but also references the next node.
- Only keep track of head, tail, and length.

Example: Singly Linked List

          HEAD                         TAIL
          (4)--->(6)--->(5)--->(2)---> null
                    Length = 4

 Compare it to an Array

    Linked Lists
  - Don't have indexes
  - Connected via nodes with a next pointer
  - Random Access not allowed

    Arrays  
  - Indexed in order!
  - Insertion and deletion can be expensive
  - Can quickly be accessed at a specific index

  When to use a linked list
  - When the primary concern is about insertion and deletion efficiency.
  - When you're working with extremely long pieces of data and don't need to really acces it, but store it.
*/

/* 
  Node Class
  - Stores a piece of data
  - Has a reference to the next node
*/

class Node {
  constructor(val){
    this.val = val;
    this.next = null;
  }
}

/* 
  Singly Linked List
  - Uses Push, Pop, and has a length
  - Creates nodes by utilizing the above node class
*/

class SinglyLinkedList {
  constructor(){
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  // Method to insert a new node to the end of the list 
  push(val){
    // First create a new node based on the above Node class, and add the new value to it.
    var newNode = new Node(val);
    // Then check if there is a value for head of the list. If there's not, set the head and tail to the new node. 
    if(!this.head){
      this.head = newNode;
      this.tail = this.head;
    }
    else {
    // Otherwise take the current tail, add the new node to the end of it
      this.tail.next = newNode;
      // Then move the tail marker over
      this.tail = newNode;
    }
    // Increment the length of the list
    this.length++;
    // Return the list
    return this;
  }
  // Method to remove a node from the list 
  pop(){
    // Make sure there are nodes
    if(!this.head){
      return undefined;
    }
    var current = this.head;
    var newTail = current;
    // While theres a next node
    while(current.next){
      // the new tail should always be lagging behind
      newTail = current;
      // keep updating the current node
      current = current.next;
    }// Once there's not a next node, the loop ends

    // Move the tail to point to the new tail
    this.tail = newTail;
    // Set the tails next value to null to sever the connection to the old tail
    this.tail.next = null;
    // Decrement the length since a node was removed
    this.length--;

    // Edge case alert, if the length hits 0 the list is empty so the head and tail should be reset to null
    if(this.length === 0){
      this.head = null;
      this.tail = null;
    }
    return current;
  }

  // Method to shift nodes by swapping out the head
  shift(){
    // Can't shift anything if there's no head
    if(!this.head){
      return undefined;
    }
    // Get the current heads value 
    var oldHead = this.head;
    // Move shift it over to the value of the next node
    this.head = oldHead.next;
    // Decrement the length
    this.length--;
     // Edge case alert, if the length hits 0 the list is empty so make sure the tail is null
     if(this.length === 0){
      this.tail = null;
    }
    return oldHead;
  }
  // Method to insert a new load to the beginning of the list
  unshift(val){
    // First create a new node and add the value to it.
    var newNode = new Node(val);
    // Then check if there is a value for head of the list. If there's not, set the head and tail to the new node. 
    if(!this.head){
      this.head = newNode;
      this.tail = this.head;
    }
    else {
      // Set the next property to the current head
      newNode.next = this.head;
      // Update the head property to be the newly created node
      this.head = newNode;
    }
    // Increment the length of the list
    this.length++;
    // Return the list
    return this;
  }

  // Takes in an index and pulls out the corresponding value
  get(index){
    // Edge case alert, index cant be negative and should not be greater than the lists length
    if(index < 0 || index >= this.length){
      return null;
    }
    // Otherwise traverse the list until you reach the index and return the node at that index
    // You need a counter
    var counter = 0;
    // You need to start at the head
    var currentNode = this.head;

    // The counter doesn't equal the index passed in
    while(counter !== index){
      // Update the current node to equal the next node
      currentNode = currentNode.next;
      // Increment the counter
      counter++;
    }// Once the loop ends current node will be at the corresponding index
    // Return current node
    return currentNode;
  }

  // Takes in an index and value, and updates the corresponding node with the new value
  set(index, value){
    // Call the get method and pass in the index
    var foundNode = this.get(index);

    // If it was found update the nodes value and return true
    if(foundNode){
      foundNode.val = value;
      return true;
    } 
    // Otherwise return false
    return false;
  }
  // Takes in and index and value and inserts a new node with the corresponding value at the specified index
  insert(index, val){
    // Edge Case Alert, index cant be less than zero or greater than the length of the list
    if(index < 0 || index > this.length){
      return false;
    }
    // If the index is equal to the lists length, just use push to add the new node to the end of the list
    if(index === this.length){
      this.push(val);
      return true;
    }
    // If the index is equal to zero just use unshift to add the new node to the front of the list
    if(index === 0){
      this.unshift(val);
      return true;
    }
    // Create a new node
    var newNode = new Node(val);
    // Get the node right before the specified index
    var previousNode = this.get(index - 1);
    // Get a reference to that nodes .next
    var tempRef = previousNode.next;
    // Set the new node to be the next of the previous node, establishing a link to one side
    previousNode.next = newNode;
    // Set the new node's next to the reference of the previous nodes next to establish the second link
    newNode.next = tempRef;
    // Increment the length of the list because the operation was successful
    this.length++;
    return true;
  }
  // Takes in an index and removes the node at that index.
  remove(index){
    // Edge Case Alert, index cant be less than zero or greater than the length of the list
    if(index < 0 || index > this.length){
      return undefined;
    }

    // If the index is specifying the tail, pop it off
    if(index === this.length - 1){
      return this.pop();
    }
    // If the index is at the beginning shift the nodes to remove the first one
    if(index === 0){
      return this.shift();
    }
    // Otherwise the node is somewhere in the middle
    // So find the node to the left of it
    var previousNode = this.get(index -1);
    // Keep a reference to the next node from that node
    var removedNode = previousNode.next;

    // Set the left nodes next equal to the next of the middle node, thus severing any links to that node
    previousNode.next = removedNode.next;
    // Decrement the length
    this.length--;
    // Return the middle node that was removed
    return removedNode;
  }
  // Reverses the linked list, a common CS interview question, take notes++
  reverse(){
    // First swap the head and the tail
    // Create a temporary reference to the head
    var tempHead = this.head;
    // Set the head equal to the tail
    this.head = this.tail;
    // Set the tail equal to the old head value
    this.tail = tempHead;
    var nextNode;
    // Make sure the end of the list is set to null
    var prevNode = null;

    for(var i = 0; i < this.length; i++){

      // Store the old heads next node
      nextNode = tempHead.next;

      // Set the old heads next node to null signifying the new end of the list
      tempHead.next = prevNode;

      // Take the new end of the list, and set its value to whatever was in the old head
      prevNode = tempHead;

      // Take the old head and set its value to the next
      tempHead = nextNode;
    }
    return this;
  }
  // Not normally needed but will be useful to show reversed linked list
  print(){
    var arr = [];
    // Set the current node to the head
    var currentNode = this.head;
    // Traverse the nodes  to show the order
    while(currentNode){
      // push the node values into an array
      arr.push(currentNode.val);
      // move to the next node
      currentNode = currentNode.next;
    }
    // Once all nodes have been traversed display the array formed
    console.log(arr);
  }
}

/* 
    Big O of Singly Linked Lists

  - Insertion = O(1) Constant Time
  - Removal Best case, from the front of the list O(1) Constant Time. Worst case from the end O(N) Linear Time.
  - Searching = O(N) Linear Time
  - Access = O(N) Linear Time

  Recap

  Singly Linked Lists excel at insertion and deletion if you don't care about random access.
  Good alternative to arrays when insertion and deletion at the beginning are frequently required.
  Arrays contain a built in index, linked lists do not.
  The idea of a list data structure that consists of nodes tends to be the foundation
  for other data structures like Stacks and Queues.
*/

/* 
  Console Experiments
*/

/* 
  Pop Tests, pop a node off, then display the current value of the list after pop
  Repeat until list is empty.
*/

// Instantiate a new list
var list = new SinglyLinkedList();

// Push three nodes on to it
list.push("Hello");
list.push("Goodbye");
list.push("World");

// Get rid of one
list.pop();
// Display
list
// ^^ Repeat
list.pop();
list
list.pop();
list


/* 
  Shift Tests, can reuse the original list if still in the same console session
*/

// Push three nodes on to it
list.push("Hello");
list.push("Goodbye");
list.push("World");

// Shift the nodes over and remove the head
list.shift();
// Display the results
list
// ^^ Repeat
list.shift();
list
list.shift();
list

/*
  Unshift Tests, 
*/

// Push three nodes on to it
list.push("Hello");
list.push("Goodbye");
list.push("World");
// Add a new head node
list.unshift("Added");
// Display the results
list
// Remove all of the nodes
list.pop();
list.pop();
list.pop();
list.pop();

// Will Hi will become the head and tail node
list.unshift("Hi");
// Unshift again, and watch "Hi" become the tail node, while "Bye" becomes the new head node
list.unshift("Bye");
// Clear out our list
list.pop();
list.pop();
/*
  Get Tests
*/

// Push four nodes on to the list
list.push("Hello");
list.push("Goodbye");
list.push("World");
list.push("<3");

// Should return "Hello"
list.get(0);
// Should return "Goodbye"
list.get(1);
// Should return "World"
list.get(2);
// Should return "<3"
list.get(3);
// Out of bounds, Should return null
list.get(5);

/* 
  Set Tests
*/

// Should return "World"
list.get(2);
// Should return true on success
list.set(2, "My Friends");
// Should now return "My Friends" at index 2
list.get(2);

/* 
  Insert Tests
*/

// First we're going to add something to the start of the list
// Display the current list
list
// Insert at 0, Should return true
list.insert(0, "First");
// List should display length of five with First at the head
list

// Now we're going to add something to the end of the list
// Should return null
list.get(5);
// Should return true
list.insert(5, "LAST");
// Should return "LAST"
list.get(5);

/* 
  Remove Tests 
*/

// Remove from the Front
// Display the list, should be a length of 6, with First at head, and LAST at tail
list
// Should return the node removed of "First"
list.remove(0);
// Display the list, should be a length of 5, with Hello at head, and LAST at tail
list

// Remove from the middle
// Should return the node removed of "<3"
list.remove(3);
// Display the list, should be a length of 4, with Hello at head, and LAST at tail
list 


// Remove from the End
// Should return the node removed of "LAST"
list.remove(3);
// Display the list, should be a length of 3, with Hello at head, and My Friends at tail
list

/*
  Reverse Tests
*/

// For this it will probably be easier to run a new console session
// After copying and pasting the Node and Stringly Linked List classes into the console run these commands

// Instantiates a new list
var list = new SinglyLinkedList();

// Pushes four values into the list
list.push("Hello");
list.push("Goodbye");
list.push("World");
list.push("<3");

// Displays whats in the list as an array
list.print();

// Run this to reverse the list
list.reverse();

// Display the freshly reversed list with the print function
list.print();

/* 
  Please forgive my grammar and comment over kill.
  I hope you enjoyed the demo and were able to follow along!
  - Brendan Pettis 
 */