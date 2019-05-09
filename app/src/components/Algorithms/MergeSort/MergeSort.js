import React, { Component } from 'react'
import * as d3 from "d3";
import './style.css';
import Highlight from 'react-highlight'
import styled from 'styled-components'
import { Modal, Button, Card } from 'react-bootstrap'

import '../global.js'

const HighlightWrapper = styled.div`
  width: 95%;
  margin: auto;
`;

class MergeSort extends Component {
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
    let el = document.getElementById('ms');

    if(el){
      el.remove();
    }
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

    var count = 1 + 50,
        durationTime = 2000/count,
        array = d3.shuffle(d3.range(1,25)),
        unsortedArray = [...array],
        steps = 0;
    
    var margin = {top: 10, right: 10, bottom: 180, left: 10};
    var width = 900 - margin.left - margin.right;
    var height = 200 - margin.top - margin.bottom;

    var barWidth = width/count;

    var x = d3.scaleLinear()
        .domain([0,count])
        .range([0, width]);

    var svg = d3.select("#merge").append("svg")
        .attr('id', 'ms')
        .attr("width", 425)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      
    var rects = svg.append("g")
        .attr("transform", "translate(" + barWidth + ", 2)")
        .attr("fill", "blue")
        .selectAll("rect")
        .data(unsortedArray)
      .enter().append("rect")
    
    var labels = svg.selectAll("text")
        .data(unsortedArray)
      .enter().append("text")
      .attr("fill", "black")
        
    labels.attr("id", function(d) {return "text" + d})
        .attr("transform", function(d, i) {return "translate(" + x(i) + ",0)"})
        .html(function(d) {return d;})

    rects.attr("id", function(d) {return "rect" + d})
        .attr("transform", function(d, i) {return "translate(" + (x(i) - barWidth) + ",0)"})
        .attr("width", barWidth *.9)
        .attr("height", function(d) {return d*barWidth/3})

    function mergeSort() {
        var mergeReps = (unsortedArray.length).toString(2).length + 1;
        var mergeArrays = [[...unsortedArray], []];

        for (let i=0; i<unsortedArray.length; i += 2) {
            mergeArrays[1].push(mergeTwo([unsortedArray[i]], [unsortedArray[i+1]]))
        }
        for (let n=2; n<mergeReps; n++) {
            mergeArrays[n] = [];
            var unMerged = mergeArrays[n-1];
            for (let i=0; i<unMerged.length; i += 2) {
                mergeArrays[n].push(mergeTwo(unMerged[i], unMerged[i+1] ? unMerged[i+1] : []))
            }
        }
        for (let i=1; i<mergeArrays.length; i++) {
            mergeArrays[i] = d3.merge(mergeArrays[i])
        }
        mergeMove(0);
    
        function mergeTwo(iArray, nArray) {
            var newArray = [];
            for (let i=0, n=0; i<iArray.length || n<nArray.length;) {
                if (iArray[i] < nArray[n]) {
                    newArray.push(iArray[i++])
                } else if (iArray[i] > nArray[n]) {
                    newArray.push(nArray[n++])
                } else if (!(iArray[i])) {
                    newArray.push(nArray[n++])
                } else if (!(nArray[n])) {
                    newArray.push(iArray[i++])
                }
            }
            return newArray;
        }

        function mergeMove(j) {
            var oldArray = mergeArrays[j],
                newArray = [...mergeArrays[j+1]];
            let sortedArray = [];

            moveStep(0);

            function moveStep(n) {
                if (global.stop) return false;            
                d3.selectAll("rect").attr("class", "")                

                d3.select("#counter").html(++steps);
                d3.select("#rect" + newArray[n]).attr("class", "testing")

                sortedArray.push(newArray[n])
                oldArray.shift()

                rects.transition().duration(durationTime)
                    .attr("transform", function(d) {
                        var xVal = sortedArray.indexOf(d) > -1 ? sortedArray.indexOf(d) : oldArray.indexOf(d) + sortedArray.length;
                        return "translate(" + x(xVal - 1) + ",0)" 
                    })

                labels
                    .classed("sorted", function(d) {
                        return !mergeArrays[j + 2] && sortedArray.indexOf(d) === d - 1;
                    })
                    .transition().duration(durationTime)
                    .attr("transform", function(d) {
                        var xVal = sortedArray.indexOf(d) > -1 ? sortedArray.indexOf(d) : oldArray.indexOf(d) + sortedArray.length;
                        return "translate(" + x(xVal) + ",0)" 
                    })

                d3.timeout(function() {
                    if (oldArray.length > 0) {
                        moveStep(++n)
                    } else if (mergeArrays[j + 2]) {
                        mergeMove(++j)
                    } else {
                        rects.classed("testing", false)
                    }
                }, durationTime);
            }
        }
    }

    function slide(d, i) {
        d3.select("#text" + d)
            .transition().duration(durationTime)
            .attr("transform", function(d) {return "translate(" + (x(i)) + ", 0)"})

        d3.select("#rect" + d)
            .transition().duration(durationTime)
            .attr("transform", function(d) {return "translate(" + (x(i-1)) + ", 0)"})                
    }

    mergeSort();
  }

  reset = () => {

    global.stop = false;

    let el = document.getElementById('ms');
 
    if(el){
      el.remove();
    }

    this.run();
  }

  render() {
    return (
      <Card style={{ width: '450px'}}> 
      <Card.Header><h1>Merge Sort</h1></Card.Header>
      <Card.Body>
        <Card.Title>What is it?</Card.Title>
        <Card.Text>
        In computer science, merge sort is an efficient, general-purpose, comparison-based sorting algorithm. Most implementations produce a stable sort, which means that the order of equal elements is the same in the input and output. Merge sort is a divide and conquer algorithm that was invented by John von Neumann in 1945.
        </Card.Text>

        <Card.Title>Visual Animation</Card.Title>
        <div id="merge"></div>
        
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
                /** 
                 *** Nicholas Papadakis-Schneider ***
                 *** THE MERGE SORT ALGORITHM ***
                
                
                 ********************************************************************************** 
                 The best way I have been described merge sort is as a divide and
                 * conquer sort. We keep spliting the array down into multiple arrays
                 * with the size of one and then build it back up again sorting it along
                 * the way. Here is a good example looking at a small array we want to sort
                 * using this algorithm. We do use a recursive function to break down the arrays
                 * so we definitely want to know a little bit about that before using the merge sort.
                 ***********************************************************************************
                
                 * This a very easy example of using the merge sort to sort a small array with 4 elements
                 * sorry for my grammer and spelling
                 ***********************************************************************************
                 * [4, 2, 3, 1] - here is our initial array
                 * 
                *[4, 2] | [3, 1] - here we split the array in half giving us two arrays.
                *an easy way to do this is to add the length of these arrays and divide by 2
                *rounding down to find our middle index. 
                * 
                [4] | [2] [3] | [1] - here we split our two arrays again which gives us our single element arrays.
                *  Now that we are broken down into our smallest size we can compare and 
                * put the arrays back together again. Here we compare our first single element array with our second
                and 'merge' them with the smallest element being put in the [0] index of the array. We 
                do the same thing with our next set of single element arrays. This gets us the result of
                * [2, 4] | [1, 3]
                * Here is where the fun starts, now we can compare our two sorted arrays by indexs because
                we now know that they are sorted.. So if we compare the first element of our array on the left
                and our first element of the array on the right we know that the smallest value between them
                is the smallest value out of both arrays and we can store it in the [0] index of the final
                array, we also know that the [1] index will be the other value because no other values
                in either array are smaller than these two. 
                Here is this with our example..first we check to see if our 
                left array [0] which is 2 > our right array [0] which is 1
                we now can put in the [0] index of our result array the value 1 
                and our [1] index of our result array the value of 2
                We repeat these steps with the next index of our arrays, this being the [1] index
                In our example arrays we have the value of 4 in our left arrays [1] index
                and a value of 3 in our right arrays [1] index. Since we already know that both of these
                values are greater than the values in our [0] and [1] indexs of the result array
                we can add the right arrays [1] index value of 3 into our [2] index of the results array 
                and add the left arrays [1] index value of 4 into the [3] index of our results array
                Here is our final result array that we return.
                *[1, 2, 3, 4]
                Sorry for the long windedness of that, but I was trying to make it as simple as i could
                while still relaying all of what is going on. This is a pretty complicated sorting
                algorithm but I think it will work really well with visualization for our project**
                
                ***********************************************************************************
                Here is working vanilla JavaScript implementation of the merge sort
                ***********************************************************************************
                This is the main function of our sort, that splits the array in half 
                and then merges it back together recursivly
                
                ***********************************************************************************/
                function theSort(arr) {
                  //this if statement only returns the array passed in if it has a length of 1.
                  //otherwise it doesn't enter the statement and moves
                  //through the function, which breaks the array in half.
                
                  if (arr.length === 1) {
                    return arr;
                  }
                
                  // get the middle item of the array rounded down
                  var middle = Math.floor(arr.length / 2);
                  // creates an array of the values on the left side of the passed in array
                  var leftArr = arr.slice(0, middle);
                  // creates an array of the values on the right side of the passed in array
                  var rightArr = arr.slice(middle);
                
                  //these console.logs give a really good idea of what this function is doing
                  console.log('left array in recursive function', leftArr);
                  console.log('right array in recursive function', rightArr);
                
                  /*Here we call theMerge function and pass in the this function twice 
                   with our left and right arrays which if needed breaks the arrays in half again
                  until we get to the arrays with a length of 1. 
                  Once we have two arrays with the length of 1
                  passed in we return it and theMerge function compares the two values against 
                  each other and sorts them into an array and returns it.
                  This continues until the final sorted array is returned.
                  */
                  return theMerge(theSort(leftArr), theSort(rightArr));
                }
                
                // compare the arrays item by item and return the concatenated result
                function theMerge(left, right) {
                  var resultArr = []; // our sorted array
                  var leftIndex = 0; //index we increment for left array
                  var rightIndex = 0; //index we increment for right array
                
                  /*for some context of this loop. The first time we get into this loop
                left.length is 1 and right.length is 1 so we only iterate throught this loop one time.
                This happens again with our next set of single element arrays. 
                */
                  while (leftIndex < left.length && rightIndex < right.length) {
                    console.log('left array length in while loop', left.length); //this is a great way to see what this loop is doing
                    console.log('right array length in while loop', right.length);
                    if (left[leftIndex] < right[rightIndex]) {
                      resultArr.push(left[leftIndex]);
                      leftIndex++;
                    } else {
                      resultArr.push(right[rightIndex]);
                      rightIndex++;
                    }
                  }
                  console.log(
                    'array result after sorting',
                    resultArr.concat(left.slice(leftIndex)).concat(right.slice(rightIndex))
                  ); // displays the sorted array to the console as we iterate
                  return resultArr
                    .concat(left.slice(leftIndex))
                    .concat(right.slice(rightIndex));
                } //end of the algorithm
                
                /***********************************************************************************
                 *  CONSOLE TESTS *
                 * 
                Light console test with our example array
                this is a good one to test first and watch the console logs to see what is happening.
                This array is a little too simple to see the full complexity of the algorithm */
                var listTwo = [4, 2, 3, 1];
                console.log(theSort(listTwo));
                //should get [1, 2, 3, 4]
                
                //middle size array. This works best for seeing most of the full complexity of the sort
                //while still not being too much to handle.
                var listThree = [10, 87, 54, 68, 223, 43, 64, 12];
                console.log(theSort(listThree));
                //should get [10, 12, 43, 54, 64, 68, 87, 223]
                
                //heavy console test, this is a complicated array we sort and is a little hard to follow
                //without knowing how this works.
                
                /*var list = [
                  277,
                  55,
                  12,
                  3,
                  744,
                  1,
                  32,
                  84634,
                  68,
                  333,
                  2234,
                  22,
                  144,
                  1567,
                  75,
                  36,
                  656,
                  236,
                  56,
                  23,
                  457
                ];
                console.log(theSort(list));*/
                //should get [1, 3, 12, 22, 23, 32, 36, 55, 56, 68, 75, 144, 236, 277, 333, 457, 656, 744, 1567, 2234, 84634]
                
                /*
                        ***BIG O NOTATION***
                the best answer i found having to do with the big O notation of this algorithm is as 
                follows -
                
                "It's O(n * log(n)). As you've accurately surmised, 
                the entire input must be iterated through, and this must occur O(log(n)) times 
                (the input can only be halved O(log(n)) times). n items iterated log(n) times gives 
                O(n log(n)).
                
                It's been proven that no comparison sort can operate faster than this. 
                Only sorts that rely on a special property of the input such as radix sort can 
                beat this complexity. The constant factors of mergesort are typically not that 
                great though so algorithms with worse complexity can often take less time."
                
                I hope you enjoyed this deminstration of the Merge Sort!
                Thanks
                
                ***************** Nicholas Papadakis-Schneider *****************
                */
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

export default MergeSort