import { Container, Stack, Typography } from '@mui/material';

const PageNotFound = () => (
  <Container className="mt-5 text-start">
    <Stack direction="column" spacing={4} className="mt-5">
      <Typography component="h1" variant="h2" sx={{ mt: 5 }}>404: Page Not Found</Typography>
      <Typography component="h2" variant="h6">
        The page you are trying to access is not available.
      </Typography>
    </Stack>
  </Container>
);

export default PageNotFound;
