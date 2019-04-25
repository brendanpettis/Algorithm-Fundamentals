import React, { Component } from 'react'
import './style.css';
import Highlight from 'react-highlight'
import styled from 'styled-components'
import { Modal, Button } from 'react-bootstrap'

const HighlightWrapper = styled.div`
  width: 95%;
  margin: auto;
`;

class ParallelArray extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      code: {
        show: false
      },
    };
  }

  handleClose(name) {
    this.setState({ [name]: { show: false }});
  }

  handleShow(name) {
    this.setState({ [name]: { show: true }});
  }
  componentDidMount = () => {
    const sneakers = ["Jordan Retro 11","Jordan Retro 3","Air Max 90","Nike Dunk SB","Air Force 1"]; //favorite shoes
    const prices = ["$170.00","$190.00","$120.00","$90.00","$90.00"];// prices
    const grade = ["A+","B","C+","C-","A-"];// My opinion grade for the shoes
    
    const table = document.querySelector('#parallel');
 
    let sneakersToAdd = sneakers.map((e) => {
       let col = document.createElement('td');
       col.innerHTML = e;
       return col;
    });

    let pricesToAdd = prices.map((e)=>{
      let col = document.createElement('td');
      col.innerHTML = e;
      return col;
    })

    let gradeToAdd = grade.map((e)=>{
      let col = document.createElement('td');
      col.innerHTML = e;
      return col;
    })

    for(let i = 0; i < sneakersToAdd.length; i++){
      let row = document.createElement('tr');
      row.appendChild(sneakersToAdd[i]);
      row.appendChild(pricesToAdd[i]);
      row.appendChild(gradeToAdd[i]);
      table.appendChild(row);
    }
  }

  render() {
    return (
      <div>
        <h1>Parallel Arrays</h1> 
        <h3>What are they?</h3>
        <h3>Big O</h3>
        <h3>Examples / Use Cases</h3>
        <table>
          <thead>
            <tr>
              <th>Sneakers</th>
              <th>Prices</th>
              <th>Rating</th>
            </tr>    
          </thead>
          <tbody id='parallel'>
          </tbody>
        </table>

        <Button variant="primary" onClick={()=> this.handleShow("code")}>
          Show What's Under the Hood
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
    /* Created by Shaquille Wright */
    const sneakers = ["Jordan Retro 11", "Jordan Retro 3", "Air Max 90", "Nike Dunk SB", "Air Force 1"];
    const prices = ["$170.00", "$190.00", "$120.00", "$90.00", "$90.00"];
    const grade = ["A+", "B", "C+", "C-", "A-"];          
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
      </div>
    )
  }
}

export default ParallelArray;
