import { Container, Stack } from '@mui/material';

const PageNotFound = () => (
  <Container className="mt-5 text-start">
    <Stack direction="column" spacing={4} className="mt-5">
      <div className="mt-5 mb-4">
        <h1>404: Page Not Found</h1>
        <h5>
          The page you are trying to access is not available.
        </h5>
      </div>
    </Stack>
  </Container>
);

export default PageNotFound;
