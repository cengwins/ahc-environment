import { CircularProgress } from '@mui/material';
import { Suspense } from 'react';

const WrapWithSuspense = ({ component } : {component: any}) => (
  <Suspense fallback={<CircularProgress />}>
    {component}
  </Suspense>
);

export default WrapWithSuspense;
