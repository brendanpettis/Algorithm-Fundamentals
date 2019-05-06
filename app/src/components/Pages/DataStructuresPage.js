import React from 'react';
import ParallelArray from '../Data-Structures/ParallelArray/ParallelArray'
import SinglyLinkedList from '../Data-Structures/SinglyLinkedList/SinglyLinkedList'
import BinaryTree from '../Data-Structures/BinaryTree/BinaryTree'
import { size, device } from './device';

import styled from 'styled-components'

const DataStructuresLayout = styled.div`

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

const DataStructuresPage = () => (
    <DataStructuresLayout>
        <CardWrapper>
            <SinglyLinkedList />
            <ParallelArray />
            <BinaryTree />
        </CardWrapper>
    </DataStructuresLayout>
);

export default DataStructuresPage;