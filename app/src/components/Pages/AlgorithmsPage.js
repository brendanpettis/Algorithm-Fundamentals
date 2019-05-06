import React from 'react';
import styled from 'styled-components'

import { device } from './device'
import BubbleSort from '../Algorithms/BubbleSort/BubbleSort'

const AlgorithmsLayout = styled.div`

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
  grid-gap: 10px;
  justify-items: center;

  @media ${device.laptop} {
    grid-template-columns: auto auto;
  }

  @media ${device.laptopL} {
    grid-template-columns: auto auto auto;
}

`;

const AlgorithmsPage = () => (
        <AlgorithmsLayout>
            <CardWrapper>
                <BubbleSort/>
            </CardWrapper>
        </AlgorithmsLayout>
);

export default AlgorithmsPage;