import { Container, Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../stores/MainStore';
import Notification from './Notification';

const Header = () => {
  const { userStore, notificationStore } = useStores();
  const { token } = userStore;
  const { notifications } = notificationStore;
  const navigate = useNavigate();

  if (localStorage.getItem('token') !== null) {
    userStore.setToken(localStorage.getItem('token') as string);
  }

  const logOut = () => {
    userStore.logOut();
    notificationStore.set('success', '', 'Logged out.');
    navigate('/');
  };

  return (
    <>
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
              {token && (
              <Nav.Link onClick={logOut}>
                Log Out
              </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {notifications && <Notification />}
    </>
  );
};

export default Header;
