import React from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Jumbotron } from 'react-bootstrap'

import { device } from './device'
import Wave from '../Wave/Wave'

const HomeLayout = styled.div`

    @media ${device.laptop} { 
        max-width: 900px;
    }

    @media ${device.laptopL} {
        max-width: 1600px;
    }
`

const CardWrapper = styled.div`
    margin-top: 20px;
    display: grid;
    grid-template-columns: auto;
    justify-items: center;
`;

const toAlgorithms = (props) => {
    let path = `/algorithms`;
    props.history.push(path);
  }

  const toDataStructures = (props) => {
    let path = `/datastructures`;
    props.history.push(path);
  }

const HomePage = (props) => (
    <HomeLayout>
      <CardWrapper>
        <Jumbotron>
            <h1>Hello, world!</h1>
            <p>
                Algorithms and Data Structures run everything in Computer Science. However, they usually only run behind the scenes and tend to be under appreciated. This project is meant to change that by offering some interesting visuals of key Algorithms and Data Structures. It's the result of a collaborative effort between students in the ITDEV-154 Data Structures and Programming Class.
            </p>
            <p>
                <Button style={{marginRight: 6}}variant="primary" onClick={()=> toAlgorithms(props)}>View Algorithms</Button>
                <Button variant="success" onClick={()=> toDataStructures(props)}>View Data Structures</Button>
            </p>
            <Wave />
        </Jumbotron>
      </CardWrapper>
    </HomeLayout>
);

export default HomePage;