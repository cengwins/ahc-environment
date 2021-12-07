import { useObserver } from 'mobx-react';
import { useState } from 'react';
import {
  Container, Form, Button, Col, Row,
} from 'react-bootstrap';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useStores } from '../stores/MainStore';

const Register = () => {
  const { userStore } = useStores();
  const [username, setUsername] = useState('');
  const [email, setMail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);

  return useObserver(() => (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container className="my-5">
        <Row className="text-start">
          <Col />
          <Col sm={4}>
            <h1 className="mt-5">
              Register
            </h1>
            <Form
              className="mt-5"
              onSubmit={(e) => {
                e.preventDefault();
                setWaitingResponse(true);
                userStore.register({
                  username, email, first_name: name, last_name: surname, password,
                }).then(() => {
                  alert('Registered!');
                }).catch((result) => {
                  alert(`Failed to register: ${result}`);
                }).finally(() => {
                  setWaitingResponse(false);
                });
              }}
            >
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control type="username" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={(e) => setMail(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="surname">
                <Form.Label>Surname</Form.Label>
                <Form.Control type="text" placeholder="Surname" onChange={(e) => setSurname(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={waitingResponse}>
                Register
              </Button>
            </Form>
          </Col>
          <Col />
        </Row>
      </Container>
      <Footer />
    </div>
  ));
};
export default Register;
