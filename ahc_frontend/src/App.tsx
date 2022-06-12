import { Box, CircularProgress } from '@mui/material';
import { observer } from 'mobx-react';
import {
  lazy, ReactElement, Suspense, useEffect, useState,
} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loading from './components/Loading';
import './App.css';
import { useStores } from './stores/MainStore';

const Header = lazy(() => import('./components/Header'));
const Footer = lazy(() => import('./components/Footer'));
const Home = lazy(() => import('./pages/Home'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PasswordReset = lazy(() => import('./pages/PasswordReset'));
const Profile = lazy(() => import('./pages/Profile'));

const AuthenticatedRoute = observer(({ component }: { component: ReactElement }) => {
  const { userStore } = useStores();
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailed] = useState(false);

  useEffect(() => {
    userStore.getProfile()
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Loading loading={loading} failed={failedToLoad} />
      {!loading && !failedToLoad && component}
    </div>
  );
});

const App = observer(() => {
  const { userStore } = useStores();
  const { token } = userStore;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Suspense fallback={<CircularProgress />}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            {token && <Route path="/profile" element={<AuthenticatedRoute component={<Profile />} />} />}
            {token && <Route path="/dashboard/*" element={<AuthenticatedRoute component={<Dashboard />} />} />}
            <Route path="/reset/:code" element={<PasswordReset />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </Suspense>
    </Box>
  );
});

export default App;
