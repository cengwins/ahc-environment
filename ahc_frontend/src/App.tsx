import { Box, CircularProgress } from '@mui/material';
import { observer } from 'mobx-react';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { useStores } from './stores/MainStore';
import WrapWithSuspense from './utils/WrapWithSuspense';

const Header = lazy(() => import('./components/Header'));
const Footer = lazy(() => import('./components/Footer'));
const Home = lazy(() => import('./pages/Home'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PasswordReset = lazy(() => import('./pages/PasswordReset'));
const Profile = lazy(() => import('./pages/Profile'));

const App = observer(() => {
  const { userStore } = useStores();
  const { token } = userStore;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Suspense fallback={<CircularProgress />}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<WrapWithSuspense component={<Home />} />} />
            {token && <Route path="/profile" element={<WrapWithSuspense component={<Profile />} />} />}
            {token && <Route path="/dashboard/*" element={<WrapWithSuspense component={<Dashboard />} />} />}
            <Route path="/reset/:code" element={<WrapWithSuspense component={<PasswordReset />} />} />
            <Route path="*" element={<WrapWithSuspense component={<PageNotFound />} />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </Suspense>
    </Box>
  );
});

export default App;
