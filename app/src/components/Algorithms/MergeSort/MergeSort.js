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
    let el = document.getElementById('qs');

    if(el){
      el.remove();
    }
  }

  run = () => {

  }

  reset = () => {
    let el = document.getElementById('ms');
 
    if(el){
      el.remove();
    }

    this.run();
  }

  com
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