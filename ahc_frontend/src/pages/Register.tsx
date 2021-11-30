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
  const [mail, setMail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');

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
                userStore.register(mail, name, surname, password);
              }}
            >
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
              <Button variant="primary" type="submit">
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
