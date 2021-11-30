import {
  Container, Form, Button, Col, Row,
} from 'react-bootstrap';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useStores } from '../stores/MainStore';
import Register from './Register';

const Login = () => {
  const { userStore } = useStores();

  console.log(userStore);
  const { username } = userStore;
  if (!username) {
    return (
      <Register />
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container className="my-5">
        <Row className="text-start">
          <Col />
          <Col sm={4}>
            {/** Placeholder login form */}
            <Form className="mt-5">
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Button variant="primary" type="submit">
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
