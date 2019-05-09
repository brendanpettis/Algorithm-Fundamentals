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