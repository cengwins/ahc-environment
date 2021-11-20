import { Container, Stack } from 'react-bootstrap';
import Header from '../components/Header';

const PageNotFound = () => (
  <div className="d-flex flex-column min-vh-100">
    <Header />
    <div className="App">
      <Container className="mt-5 text-start">
        <Stack direction="vertical" gap={4} className="mt-5">
          <div className="mt-5 mb-4">
            <h1>404: Page Not Found</h1>
            <h5>
              The page you are trying to access is not available.
            </h5>
          </div>
        </Stack>
      </Container>
    </div>
  </div>
);

export default PageNotFound;
