import { Box, CircularProgress } from '@mui/material';
import { observer } from 'mobx-react';
import {
  ReactElement, Suspense, useEffect, useState,
} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loading from './components/Loading';
import './App.css';
import WrapWithSuspense from './utils/WrapWithSuspense';
import { useStores } from './stores/MainStore';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';
import Dashboard from './pages/Dashboard';
import PasswordReset from './pages/PasswordReset';
import Profile from './pages/Profile';

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
            <Route path="/" element={<WrapWithSuspense component={<Home />} />} />
            {token && <Route path="/profile" element={<WrapWithSuspense component={<AuthenticatedRoute component={<Profile />} />} />} />}
            {token && <Route path="/dashboard/*" element={<WrapWithSuspense component={<AuthenticatedRoute component={<Dashboard />} />} />} />}
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
