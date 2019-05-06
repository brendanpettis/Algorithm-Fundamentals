import React from 'react'
import styled from 'styled-components'
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
    margin-top: 50px;
    margin-bottom: 50px;
    display: grid;
    grid-template-columns: auto;
    justify-items: center;
`;

const HomePage = () => (
    <HomeLayout>
      <CardWrapper>
          <Wave />
      </CardWrapper>
    </HomeLayout>
);

export default HomePage;