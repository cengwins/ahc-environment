import { Container, Stack, Typography } from '@mui/material';

const PageNotFound = () => (
  <Container sx={{ mt: 5 }}>
    <Stack direction="column" spacing={4} sx={{ mt: 5 }}>
      <Typography component="h1" variant="h2">404: Page Not Found</Typography>
      <Typography component="h2" variant="h6">
        The page you are trying to access is not available.
      </Typography>
    </Stack>
  </Container>
);

export default PageNotFound;
