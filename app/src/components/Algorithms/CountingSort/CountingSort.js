import React, { Component } from 'react'
import * as d3 from "d3";
import './style.css';
import Highlight from 'react-highlight'
import styled from 'styled-components'
import { Modal, Button, Card } from 'react-bootstrap'

import CountSort from './count.js'

const HighlightWrapper = styled.div`
  width: 95%;
  margin: auto;
`;

class CountingSort extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      code: {
        show: false
      },
      run: false
    };
  }

  handleClose(name) {
    this.setState({ [name]: { show: false }});
  }

  handleShow(name) {
    this.setState({ [name]: { show: true }});
  }

  componentWillUnmount = () => {

  }

  run = () => {
    // Check for quicksort running
    let el = document.getElementById('qs');
    // remove quicksort
    if(el){
      el.remove();
    }

    // reassign to heapsort
    el = document.getElementById('heap');
    // remove heapsort
    if(el){
      el.remove();
    }

    this.setState({ run: true });
    const MAXVALUE = 20;

    // User-configurable animation settings
    let delay = 500;
    let arraySize = 15;

    // Page elements
 //   const unsortedTable = document.getElementById("unsorted-array");
  //  const countingTable = document.getElementById("counting-array");
   // const sortedTable = document.getElementById("sorted-array");



    const unsortedTable = document.createElement('div')
    unsortedTable.id = 'unsorted-array';

    const countingTable = document.createElement('div')
    countingTable.id = 'counting-array';

    const sortedTable = document.createElement('div')
    sortedTable.id = 'sorted-array';

    const mainTable = document.getElementById('array-vis');

    let title1 = document.createElement('h4');
    let title2 = document.createElement('h4');
    let title3 = document.createElement('h4');

    title1.innerHTML = "Unsorted Array";
        
    mainTable.appendChild(title1);
    mainTable.appendChild(unsortedTable);

  
    title2.innerHTML = "Frequency of Values";
          
    mainTable.appendChild(title2);
    mainTable.appendChild(countingTable);

    title3.innerHTML = "Sorted Array";

    mainTable.appendChild(title3);
    mainTable.appendChild(sortedTable);
  

    // TimerIds
    let countingId;
    let sortingId;

    // Array generation variables
    const arrayGeneration = {
    unsortedArray: null,
    sort: null,
    counts: null,
    };

    // Iteration counting variables
    const counters = {
    i: 0,
    j: 0,
    counterValue: null,
    };

    let isAnimationRunning = false;

    function generateUnsortedArray() {
    for (let i = 0; i < arraySize; i++) {
    const randomNumber = Math.ceil(Math.random() * MAXVALUE);
    arrayGeneration.unsortedArray.push(randomNumber);
    const tableData = document.createElement("div");
    tableData.textContent = randomNumber;
    tableData.id = `unsorted-item-${i}`;
    tableData.className = "unsorted-item";
    tableData.style.backgroundColor = setBackgroundColor(randomNumber);
    unsortedTable.appendChild(tableData);
    }
    }

    function generateCountingArray() {
    for (let i = 1; i <= MAXVALUE; i++) {
    const tableContainer = document.createElement("div");
    const tableLabel = document.createElement("div");
    const tableData = document.createElement("div");
    tableLabel.textContent = `${i}`;
    tableLabel.className = "counting-label";
    tableData.id = `counting-item-${i}`;
    tableData.className = "counting-item";
    tableData.textContent = 0;
    tableData.style.backgroundColor = setBackgroundColor(i);
    tableContainer.appendChild(tableLabel);
    tableContainer.appendChild(tableData);
    countingTable.appendChild(tableContainer);
    }
    }

    function generateSortingArray() {
    for (let i = 0; i < arraySize; i++) {
    const tableData = document.createElement("div");
    tableData.id = `sorted-item-${i}`;
    tableData.className = "sorted-item";
    sortedTable.appendChild(tableData);
    }
    }

    function setBackgroundColor(i) {
    // Colour hex values for items
    const colours = {
    red: "#FF4242",
    orange: "#FCA22D",
    yellow: "#E2E539",
    green: "#3BF994",
    blue: "#3B84F9",
    purple: "#DD3BF9",
    };

    if (i <= 5) return colours.red;
    else if (i <= 10) return colours.orange;
    else if (i <= 15) return colours.yellow;
    else if (i <= 20) return colours.green;
    else if (i <= 25) return colours.blue;
    else return colours.purple;
    }

    function startAnimation() {

    arrayGeneration.unsortedArray = [];
    generateUnsortedArray();
    generateCountingArray();
    generateSortingArray();

    arrayGeneration.sort = new CountSort(arrayGeneration.unsortedArray);
    arrayGeneration.counts = arrayGeneration.sort.sort();
    }

    function animateCountingArray() {
    // Remove the selected class from the previous iteration
    if (counters.i > 0) {
    const previousArrayItem = document.getElementById(
    `unsorted-item-${counters.i - 1}`
    );
    const previousCountItem = document.getElementById(
    `counting-item-${arrayGeneration.unsortedArray[counters.i - 1]}`
    );
    previousArrayItem.classList.remove("selected");
    previousCountItem.classList.remove("selected");
    }
    // Reset the counter and start the next animation
    if (counters.i === arraySize) {
    counters.i = 0;
    sortingId = setTimeout(animateSortedArray, delay);
    return;
    }
    // Add selected class and insert correct number
    const arrayItem = document.getElementById(`unsorted-item-${counters.i}`);
    const countItem = document.getElementById(
    `counting-item-${arrayGeneration.unsortedArray[counters.i]}`
    );
    arrayItem.classList.add("selected");
    countItem.classList.add("selected");
    countItem.textContent = Number(countItem.textContent) + 1;

    // Advance index counter
    counters.i++;

    // Advance to next iteration
    countingId = setTimeout(animateCountingArray, delay);
    }

    function animateSortedArray() {
    // Stop animating when we reach the end
    if (counters.j >= arrayGeneration.counts.length) {
    clearTimeout(sortingId);
    }
    // Clear selected class from previous iteration
    if (counters.i > 0) {
    const previousSortedItem = document.getElementById(
    `sorted-item-${counters.i - 1}`
    );
    previousSortedItem.classList.remove("selected");
    }
    // Finish here when we reach the end
    if (counters.i === arraySize) {
    const previousCountingItem = document.getElementById(
    `counting-item-${arrayGeneration.counts[counters.j - 1][0]}`
    );
    previousCountingItem.classList.remove("selected");
    counters.i = 0;
    counters.j = 0;
    counters.counterValue = null;
    isAnimationRunning = false;
    return;
    }
    // Animate!
    const sortedItem = document.getElementById(`sorted-item-${counters.i}`);
    const countingItem = document.getElementById(
    `counting-item-${arrayGeneration.counts[counters.j][0]}`
    );
    // Remove selected from classList of previous counter array item
    if (counters.counterValue === -1) {
    const previousCountingItem = document.getElementById(
    `counting-item-${arrayGeneration.counts[counters.j - 1][0]}`
    );
    previousCountingItem.classList.remove("selected");
    counters.counterValue = null;
    }
    // Keep track of counter value while iterating
    if (counters.counterValue === null) {
    counters.counterValue = arrayGeneration.counts[counters.j][1];
    countingItem.classList.add("selected");
    }
    sortedItem.classList.add("selected");
    sortedItem.textContent = arrayGeneration.counts[counters.j][0];
    sortedItem.style.backgroundColor = setBackgroundColor(
    arrayGeneration.counts[counters.j][0]
    );
    counters.i++;
    counters.counterValue--;
    if (counters.counterValue === 0) {
    // Reset counterValue and move to next cell in counting array
    counters.j++;
    counters.counterValue--;
    }
    sortingId = setTimeout(animateSortedArray, delay);
    }

  function stopAnimation() {
        clearTimeout(countingId);
        clearTimeout(sortingId);
  }

  function resetCounters() {
      counters.i = 0;
      counters.j = 0;
      counters.counterValue = null;
    }
  

      stopAnimation();
      resetCounters();
      isAnimationRunning = true;
      startAnimation();
      countingId = setTimeout(animateCountingArray, delay);
  }

  reset = () => {

    global.stop = false;

    let el = document.getElementById('array-vis');
 
    if(el){
      el.remove();
    }

    let newVis = document.createElement('div');
    newVis.id = 'array-vis';

    let countS = document.getElementById('cs');

    countS.appendChild(newVis);

    this.run();
  }

  render() {
    return (
      <Card style={{ width: '660px'}}> 
      <Card.Header><h1>Counting Sort</h1></Card.Header>
      <Card.Body>
        <Card.Title>What is it?</Card.Title>

        <Card.Text>
        In computer science, counting sort is an algorithm for sorting a collection of objects according to keys that are small integers; that is, it is an integer sorting algorithm. It operates by counting the number of objects that have each distinct key value, and using arithmetic on those counts to determine the positions of each key value in the output sequence. Its running time is linear in the number of items and the difference between the maximum and minimum key values, so it is only suitable for direct use in situations where the variation in keys is not significantly greater than the number of items.
        </Card.Text>

        <Card.Title>Visual Animation</Card.Title>
        
        <div id="cs" style={{marginBottom: 10}}>
          <div id="array-vis"></div>
        </div>
  
        <>

    <Button variant="secondary" onClick={() => this.run()} disabled={this.state.run}>Run</Button>
      <Button style={{marginLeft: 4}} variant="secondary" onClick={() => this.reset()} disabled={!this.state.run}>Replay</Button>
      <Button style={{marginLeft: 4}} variant="primary" onClick={()=> this.handleShow("code")}>
      Sample Code
    </Button>

    <Modal size="lg" show={this.state.code.show} onHide={() => this.handleClose("code")}>
      <Modal.Header closeButton>
        <Modal.Title>Sample Code Implementation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <HighlightWrapper>
          <Highlight innerHTML={true}>{'<h3>Sample Code Implementation</h3>'}</Highlight>
          <Highlight language="javascript">
            {`
              function countingSort(arrayOne, min, max) // counting sort method, that takes in a array, min value, and max value to compare.
              {
              var i, z = 0, count = [];
              
              for (i = min; i <= max; i++) {
                  count[i] = 0;       // running a loop, to get count of said array. 
              }
              
              for (i=0; i < arrayOne.length; i++) {
                  count[arrayOne[i]]++;    
              }
              
              for (i = min; i <= max; i++) {
                  while (count[i]-- > 0) {
                      arrayOne[z++] = i; // looping thorugh array until, the count is count array; is greater then 0. In other words,
                                          // until there is no more values to loop thorugh. 
                  }
              }
              return arrayOne;
              }
              var finalArray = [3, 0, 2, 5, 4, 1];
              console.log("Original Array Elements");
              console.log(finalArray);
              console.log("Sorted Array Elements");
              console.log(countingSort(finalArray, 0, 6));
            `}
          </Highlight>
        </HighlightWrapper>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={()=> this.handleClose("code")}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  
      </Card.Body>
    </Card>
    );
  }
}

export default CountingSort