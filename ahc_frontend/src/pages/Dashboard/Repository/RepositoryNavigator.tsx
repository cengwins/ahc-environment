import {
  Location, Route, Routes, useLocation, useNavigate, useParams,
} from 'react-router-dom';
import { observer } from 'mobx-react';
import {
  Box, Button, Tab, Tabs, Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { GitHub } from '@mui/icons-material';
import { blue, grey } from '@mui/material/colors';
import { useStores } from '../../../stores/MainStore';
import { DashboardNavigationInterface } from '../../../stores/DashboardNavigationStore';

import RepositoryExperiments from './RepositoryExperiments';
import Experiment from './Experiment';
import RepositoryHome from './RepositoryHome';
import Loading from '../../../components/Loading';
import PageNotFound from '../../PageNotFound';

const getInitialValue = (
  location: Location,
  dashboardNavigationStore: DashboardNavigationInterface,
) => {
  const pathName = location.pathname.replace(/\/+$/, '');
  if (location.pathname.startsWith(`/dashboard/${dashboardNavigationStore.repositoryId}`)) {
    return `/dashboard/${dashboardNavigationStore.repositoryId}` === pathName ? 0 : 1;
  }
  return pathName === '/dashboard' ? 0 : 1;
};

const RepositoryNavigator = observer(() => {
  const { dashboardNavigationStore, repositoriesStore } = useStores();
  const { repositoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialValue = getInitialValue(location, dashboardNavigationStore);
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailed] = useState(false);
  const [value, setValue] = useState(initialValue);

  const { currentRepository: repository } = repositoriesStore;

  useEffect(() => {
    if (repositoryId) {
      dashboardNavigationStore.setRepositoryId(repositoryId)
        .catch(() => setFailed(true))
        .finally(() => setLoading(false));
    }
  }, []);

  if (initialValue !== value) setValue(initialValue);

  if (!repository && failedToLoad) {
    return (<PageNotFound />);
  }

  if (!repository || loading) {
    return (
      <Loading loading={loading} failed={failedToLoad || !repository} />
    );
  }

  const routes : {
  path: string;
  Component: any;
  name: string;
}[] = [
  {
    path: '/',
    name: `Repository: ${dashboardNavigationStore.repositoryId}`,
    Component: <RepositoryHome repository={repository} />,
  },
  {
    path: '/experiments',
    name: 'Experiments',
    Component: <RepositoryExperiments repository={repository} />,
  },
  {
    path: '/:experimentId',
    name: `Experiment: ${dashboardNavigationStore.experimentId}`,
    Component: <Experiment />,
  },
];

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex' }}>
        <Typography component="h2" variant="h4" sx={{ mt: 2, color: `${blue[700]}` }}>
          {repository.name}
          {' '}
        </Typography>
        <Typography
          component="h6"
          variant="subtitle2"
          sx={{
            color: `${grey[900]}`, fontFamily: 'monospace', backgroundColor: '#ddd', alignSelf: 'center', ml: 1,
          }}
        >
          {repository.slug}
        </Typography>
        <Box sx={{ my: 2, ml: 'auto' }}>
          <Button target="_blank" variant="outlined" sx={{ mr: 1 }} href={repository.upstream} startIcon={<GitHub />}>
            View repository on GitHub
          </Button>
          <Button target="_blank" variant="outlined" href={repository.upstream.replace('github.com', 'github.dev')} startIcon={<GitHub />}>
            Open in GitHub.dev
          </Button>
        </Box>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={(_, val) => {
            setValue(val);
            if (val === 0) navigate(`/dashboard/${dashboardNavigationStore.repositoryId}`);
            else navigate(`/dashboard/${dashboardNavigationStore.repositoryId}/experiments`);
          }}
          aria-label="basic tabs example"
        >
          <Tab label="Overview" />
          <Tab label="Experiments" />
        </Tabs>
      </Box>
      <Routes>
        {routes.map(({ path, Component, name }) => (
          <Route path={path} key={name} element={Component} />
        ))}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Box>
  );
});

export default RepositoryNavigator;
