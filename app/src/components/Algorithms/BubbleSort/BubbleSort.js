import React, { Component } from 'react'
import Highlight from 'react-highlight'
import styled from 'styled-components'
import { Modal, Button, Card } from 'react-bootstrap'

import './style.css';

const HighlightWrapper = styled.div`
  width: 95%;
  margin: auto;
`;

class BubbleSort extends Component {
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
    let el = document.getElementById('canvas');

    if(el){
      el.remove();
    }
  }

  run = () => {
    this.setState({ run: true });

      var N = 40; // Array Size
      var XYs = 10; // Element Visual Size
      var Xp = 1; // Start Pos X
      var Yp = 1; // Start Pos Y
      var canvas;
      var l = Array.apply(null, {
        length: N
      }).map(Number.call, Number);
  
      Array.prototype.shuffle = function () {
        var i = this.length,
          j, temp;
        if (i === 0) return this;
        while (--i) {
          j = Math.floor(Math.random() * (i + 1));
          temp = this[i];
          this[i] = this[j];
          this[j] = temp;
        }
        return this;
      }
  
      function map_range(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
      }
  
      function rainbow(x) {
        var m = map_range(x, 0, N, 0, 359);
        return 'hsl(' + m + ',100%,50%)';
      }
  
      function init() {
        let tempCanvas = document.createElement('CANVAS');
        tempCanvas.setAttribute("id", "canvas");

        let div = document.getElementById('bubble');
        div.appendChild(tempCanvas);

        canvas = document.getElementById('canvas');
        canvas.height = 100;
        canvas.width = 400;

        l.shuffle();
        var sort = bubbleSort(l);
        // an anim function triggered every 60th of a second
        function anim() {
          requestAnimationFrame(anim);
          draw();
          sort.next(); // call next iteration of the bubbleSort function
        }
        anim();
      }
  
      function draw() {
        if (canvas.getContext) {
          var ctx = canvas.getContext('2d');
          for (var i = 0; i < l.length; i++) {
            ctx.fillStyle = rainbow(l[i]);
            ctx.fillRect((Xp * i) * XYs, Yp * XYs, XYs, XYs);
          }
        }
      }
  
      function* bubbleSort(a) { // * is magic
        var swapped;
        do {
          swapped = false;
          for (var i = 0; i < a.length - 1; i++) {
            if (a[i] > a[i + 1]) {
              var temp = a[i];
              a[i] = a[i + 1];
              a[i + 1] = temp;
              swapped = true;
              yield swapped; // pause here
            }
          }
        } while (swapped);
      }
      init();
  }

  rerun = () => {
    let el = document.getElementById('canvas');

    if(el){
      el.remove();
    }

    this.run();
  }

  render() {
    return (
      <Card style={{ width: '450px'}}> 
      <Card.Header><h1>Bubble Sort</h1></Card.Header>
      <Card.Body>
        <Card.Title>What is it?</Card.Title>
        <Card.Text>
        Bubble sort, sometimes referred to as sinking sort, is a simple sorting algorithm that repeatedly steps through the list, compares adjacent pairs and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted. The algorithm, which is a comparison sort, is named for the way smaller or larger elements "bubble" to the top of the list. Although the algorithm is simple, it is too slow and impractical for most problems even when compared to insertion sort. Bubble sort can be practical if the input is in mostly sorted order with some out-of-order elements nearly in position.
        </Card.Text>

        <Card.Title>Visual Animation</Card.Title>
        <div id='bubble'></div>
       
        <>
        <Button variant="secondary" onClick={() => this.run()} disabled={this.state.run}>Run</Button>
        <Button style={{marginLeft: 4}} variant="secondary" onClick={() => this.rerun()} disabled={!this.state.run}>Replay</Button>
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
  function bubble_Sort(a)
  {
      var swapp;
      var n = a.length-1;
      var x=a;
      do {
          swapp = false;
          for (var i=0; i < n; i++)
          {
              if (x[i] < x[i+1])
              {
                 var temp = x[i];
                 x[i] = x[i+1];
                 x[i+1] = temp;
                 swapp = true;
              }
          }
          n--;
      } while (swapp);
   return x; 
  }
  
  console.log(bubble_Sort([12, 345, 4, 546, 122, 84, 98, 64, 9, 1, 3223, 455, 23, 234, 213]));
          
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

export default BubbleSort