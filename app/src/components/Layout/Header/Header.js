import React from 'react';
import { NavLink } from 'react-router-dom';
import {Nav, Navbar } from 'react-bootstrap'
import '../Header/Header.css';

const Header = () => (
    <header>   
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand>
          <NavLink to='/' activeClassName='is-active' exact={true}>
            <img
              alt="Letter A"
              src="/favicon.ico"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            {' Algorithm Fundamentals'}
          </NavLink>  
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto"> 
            
              <NavLink className="nav-link" to='/' activeClassName='is-active' exact={true}>Home</NavLink>          
              <Nav.Link className="nav-link" href="/algorithms" activeClassName='is-active'>Algorithms</Nav.Link>    <Nav.Link className="nav-link" href="/datastructures" activeClassName='is-active'>Data Structures</Nav.Link>   
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
);

export default Header;