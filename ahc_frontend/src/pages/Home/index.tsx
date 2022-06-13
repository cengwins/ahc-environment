import {
  Container,
  Stack,
} from '@mui/material';

import WrapWithSuspense from '../../utils/WrapWithSuspense';

import Team from './Team';
import Objectives from './Objectives';
import Features from './Features';
import About from './About';

const Home = () => (
  <Container sx={{ mt: 5 }}>
    <Stack direction="column" spacing={4} sx={{ my: 5 }}>
      <WrapWithSuspense component={<About />} />
      <WrapWithSuspense component={<Features />} />
      <WrapWithSuspense component={<Objectives />} />
      <WrapWithSuspense component={<Team />} />
    </Stack>
  </Container>
);

export default Home;
