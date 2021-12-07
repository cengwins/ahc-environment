import { useObserver } from 'mobx-react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useStores } from '../stores/MainStore';

const Header = () => {
  const { userStore } = useStores();
  const { token } = userStore;

  return useObserver(() => (
    <Navbar bg="light" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand href="/">AHC</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/team">Team</Nav.Link>
            {token && <Nav.Link href="/dashboard">Dashboard</Nav.Link>}
            {!token && <Nav.Link href="/login">Log In</Nav.Link>}
            {!token && <Nav.Link href="/register">Register</Nav.Link>}
            {token && <Nav.Link href="/profile">Profile</Nav.Link>}
            {token && <Nav.Link onClick={() => userStore.logOut()}>Log Out</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  ));
};

export default Header;
