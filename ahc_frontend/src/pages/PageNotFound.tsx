import { Container, Stack, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';

const PageNotFound = () => (
  <Container sx={{ mt: 5 }}>
    <Stack direction="column" spacing={4} sx={{ mt: 5 }}>
      <Typography alignSelf="center" sx={{ color: `${blue[700]}` }} component="h1" variant="h2">404: Page Not Found</Typography>
      <Typography alignSelf="center" sx={{ color: `${blue[600]}` }} component="h2" variant="h6">
        The page you are trying to access is not available.
      </Typography>
    </Stack>
  </Container>
);

export default PageNotFound;
