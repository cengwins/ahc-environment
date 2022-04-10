import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { CircularProgress } from '@mui/material';
import { Suspense } from 'react';

const WrapWithSuspense = ({ component } : {component: ReactJSXElement}) => (
  <Suspense fallback={<CircularProgress />}>
    {component}
  </Suspense>
);

export default WrapWithSuspense;
