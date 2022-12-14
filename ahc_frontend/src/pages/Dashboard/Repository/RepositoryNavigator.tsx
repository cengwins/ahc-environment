import {
  Location, Route, Routes, useLocation, useNavigate, useParams,
} from 'react-router-dom';
import { observer } from 'mobx-react';
import {
  Box, Button, Tab, Tabs, Typography,
} from '@mui/material';
import {
  useState, useEffect,
} from 'react';
import { blue, grey } from '@mui/material/colors';
import { GitHub } from '@mui/icons-material';
import { useStores } from '../../../stores/MainStore';

import Loading from '../../../components/Loading';
import WrapWithSuspense from '../../../utils/WrapWithSuspense';

import RepositoryExperiments from './RepositoryExperiments';
import Experiment from './Experiment';
import RepositoryHome from './RepositoryHome';
import PageNotFound from '../../PageNotFound';
import RepositoryConfig from './RepositoryConfig';

const getInitialValue = (
  location: Location,
  repositoryId: string,
) => {
  const pathName = location.pathname.replace(/\/+$/, '');
  if (pathName === `/dashboard/${repositoryId}`) {
    return 0;
  } if (pathName === `/dashboard/${repositoryId}/config`) {
    return 1;
  } if (pathName === `/dashboard/${repositoryId}/experiments`) {
    return 2;
  }
  return false;
};

const RepositoryNavigator = observer(() => {
  const { dashboardNavigationStore, repositoriesStore } = useStores();
  const { repositoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialValue = getInitialValue(location, repositoryId as string);
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailed] = useState(false);
  const [value, setValue] = useState<number | false>(initialValue);

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
    path: '/config',
    name: `Repository Config: ${dashboardNavigationStore.repositoryId}`,
    Component: <RepositoryConfig repository={repository} />,
  },
  {
    path: '/experiments',
    name: 'Experiments',
    Component: <RepositoryExperiments repository={repository} />,
  },
  {
    path: '/experiments/:experimentId',
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
            else if (val === 1) navigate(`/dashboard/${dashboardNavigationStore.repositoryId}/config`);
            else navigate(`/dashboard/${dashboardNavigationStore.repositoryId}/experiments`);
          }}
          aria-label="basic tabs example"
        >
          <Tab label="Overview" />
          <Tab label="Configure" />
          <Tab label="Experiments" />
        </Tabs>
      </Box>
      <Routes>
        {routes.map(({ path, Component, name }) => (
          <Route
            path={path}
            key={name}
            element={(<WrapWithSuspense component={Component} />)}
          />
        ))}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Box>
  );
});

export default RepositoryNavigator;
