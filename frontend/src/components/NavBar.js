import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';

const NavBar = ({ isAuthenticated, onLogout }) => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Navbar.Brand as={Link} to="/">MyApp</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="ml-auto">
          {!isAuthenticated ? (
            <>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </>
          ) : (
            <>
              <Button variant="outline-danger" onClick={onLogout} className="mr-2">Logout</Button>
              <Nav.Link as={Link} to="/userlist">User List</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
