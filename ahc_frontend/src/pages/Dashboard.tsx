import {
  Container, Stack,
} from 'react-bootstrap';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Dashboard = () => (
  <div className="d-flex flex-column min-vh-100">
    <Header />
    <Container className="my-5 text-start">
      <Stack direction="vertical" gap={4} className="mt-5">
        <div className="mb-4">
          <h1>AHC Dashboard</h1>
          <h5 style={{ maxWidth: '480px' }}>
            Wireless Ad Hoc Cloud Computing, Learning and Experimentation Environment
          </h5>
        </div>
      </Stack>
    </Container>
    <Footer />
  </div>
);

export default Dashboard;
