import {
  Container,
  Stack,
} from '@mui/material';
import { lazy } from 'react';

import WrapWithSuspense from '../../utils/WrapWithSuspense';

const Team = lazy(() => import('./Team'));
const Objectives = lazy(() => import('./Objectives'));
const Features = lazy(() => import('./Features'));
const About = lazy(() => import('./About'));

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
