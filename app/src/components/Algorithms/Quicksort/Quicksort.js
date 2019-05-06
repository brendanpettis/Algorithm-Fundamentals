import React, { Component } from 'react'
import * as d3 from "d3";
import './style.css';
import Highlight from 'react-highlight'
import styled from 'styled-components'
import { Modal, Button, Card } from 'react-bootstrap'

const HighlightWrapper = styled.div`
  width: 95%;
  margin: auto;
`;

class Quicksort extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      code: {
        show: false
      },
      experiments: {
        show: false
      }
    };
  }

  handleClose(name) {
    this.setState({ [name]: { show: false }});
  }

  handleShow(name) {
    this.setState({ [name]: { show: true }});
  }

  componentDidMount = () => {
    var n = 150

    var z = d3.scaleSequential(d3.interpolateRainbow).domain([0, n])
    
    var data = d3.range(n)
    
    var svg = d3.select('#quicky').append('svg')
      .attr('id', 'qs')
      .attr('width', 400)
      .attr('height', 200)
    
    var g = svg.append('g')
    
    var rect = g.selectAll('rect')
      .data(data, Number)
    .enter()
      .append('rect')
      .attr('width', function (d, i) { return i + 1 })
      .attr('height', 1)
      .attr('x', 1)
      .attr('y', function (d, i) { return i })
      .attr('fill', z)
    
    function* sort () {
      function* recurse (left, right) {
        if (left <= right) {
          var l = left, r = right, mid = data[Math.floor((left + right) / 2)]
          while (l <= r) {
            for (; l <= right && data[l] < mid; ++l);
            for (; r > left && data[r] > mid; --r);
            if (l <= r) {
              yield* swap(l++, r--)
            }
          }
          yield * recurse(left, r)
          yield * recurse(l, right)
        }
      }
    
      function* swap (i, j) {
        if (i === j) return
        yield [i, j]
        var t = data[i]
        data[i] = data[j]
        data[j] = t
      }
    
      yield * recurse(0, data.length - 1)
    }
    
    var gen = { next () { return { done: true } } }
    
    d3.timer(function () {
      var v
      while ((v = gen.next()).done) {
        d3.shuffle(data)
        gen = sort()
      }
      rect.data(data, Number)
        .attr('y', function (d, i) { return i })
    
      var line = g.selectAll('.line')
        .data(v.value)
    
      line.enter().append('rect')
        .attr('class', 'line')
        .attr('x', 0)
        .attr('height', 1)
        .attr('width', n)
      .merge(line)
        .attr('y', function (d, i) { return d })
    
      line.exit().remove()
    })

  }

  rerun = () => {
    let el = document.getElementById('qs');
    el.remove();
    this.componentDidMount();
  }
  render() {
    return (
      <Card style={{ width: '450px'}}> 
      <Card.Header><h1>Quicksort</h1></Card.Header>
      <Card.Body>
        <Card.Title>What is it?</Card.Title>
        <Card.Text>
        Quicksort (sometimes called partition-exchange sort) is an efficient sorting algorithm, serving as a systematic method for placing the elements of a random access file or an array in order. Developed by British computer scientist Tony Hoare in 1959 and published in 1961, it is still a commonly used algorithm for sorting. When implemented well, it can be about two or three times faster than its main competitors, merge sort and heapsort.
        </Card.Text>

        <Card.Title>Visual Animation</Card.Title>
        <div id="quicky"></div>
        
        <>
    <Button variant="primary" onClick={()=> this.handleShow("code")}>
      Sample Code
    </Button>
      <Button style={{marginLeft: 4}}variant="secondary" onClick={() => this.rerun()}>Replay</Button>
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

export default Quicksort