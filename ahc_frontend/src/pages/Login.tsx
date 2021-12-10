import { useState } from 'react';
import {
  Container, Form, Button, Col, Row,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useStores } from '../stores/MainStore';

const Login = () => {
  const { userStore, notificationStore } = useStores();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container className="my-5">
        <Row className="text-start">
          <Col />
          <Col sm={4}>
            <h1 className="mt-5">
              Log in
            </h1>
            <Form
              className="mt-5"
              onSubmit={(e) => {
                e.preventDefault();
                setWaitingResponse(true);
                userStore.login({ username, password }).then(() => {
                  notificationStore.set('success', '', 'Logged in!');
                  navigate('/');
                }).catch((result) => {
                  notificationStore.set('danger', '', result.message);
                }).finally(() => {
                  setWaitingResponse(false);
                });
              }}
            >
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter user name" onChange={(e) => setUsername(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={waitingResponse}>
                Log In
              </Button>
            </Form>
          </Col>
          <Col />
        </Row>
      </Container>
      <Footer />
    </div>
  );
};
export default Login;
