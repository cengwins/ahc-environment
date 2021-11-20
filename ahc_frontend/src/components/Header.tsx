import { Container, Nav, Navbar } from 'react-bootstrap';

const Header = () => (
  <Navbar bg="light" expand="lg" fixed="top">
    <Container>
      <Navbar.Brand href="/">AHC</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Nav>
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/team">Team</Nav.Link>
          <Nav.Link href="/dashboard">Dashboard</Nav.Link>
          <Nav.Link href="/login">Log In</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default Header;
