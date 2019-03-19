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
              <NavLink className="nav-link" to='/algorithms' activeClassName='is-active'>Algorithms</NavLink>        
              <NavLink className="nav-link" to='/datastructures' activeClassName='is-active'>Data Structures</NavLink>   
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
);

export default Header;