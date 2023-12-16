import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BasicNav.css';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function BasicNav() {

    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        async function fetchUserData() {
        try {
            const response = await axios.get('/api/user/isLoggedIn');
            if (response.data.username) {
            setUsername(response.data.username);
            setIsLoggedIn(true);
            } else {
            setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('An error occurred while checking login status:', error);
            setIsLoggedIn(false);
        }
    }
        fetchUserData();
    }, [username]);

    async function logOut() {
        axios.post('/api/user/logout', {});
        setUsername('');
        navigate('/login')
    }

  return (
    <Navbar bg="light" className="navbar-custom" fixed="top">
      <Container>
        <Navbar.Brand href="/" className="brand-custom">Fake Twitter</Navbar.Brand>
        <Nav className="ms-auto" style={{ alignItems: 'center' }}>
          <Nav.Link href="/">Home</Nav.Link>
          {isLoggedIn ? (
            <>
              <Nav.Link href={`/user/${username}`}>{username}</Nav.Link>
              <Nav.Link onClick={logOut}>Log out</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link href="/login">Log In</Nav.Link>
              <Nav.Link href="/signup">Sign Up</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default BasicNav;
