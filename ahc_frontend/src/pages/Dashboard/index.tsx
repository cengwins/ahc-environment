import {
  Route, Routes, useLocation, useNavigate,
} from 'react-router-dom';
import { observer } from 'mobx-react';
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Stack,
} from '@mui/material';
import { useStores } from '../../stores/MainStore';
import WrapWithSuspense from '../../utils/WrapWithSuspense';

import DashboardHome from './DashboardHome';
import RepositoryNavigator from './Repository/RepositoryNavigator';
import PageNotFound from '../PageNotFound';

const Dashboard = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dashboardNavigationStore } = useStores();

  const { repositoryId, experimentId } = dashboardNavigationStore;

  const routes : {
    path: string;
    currentPath: string;
    Component: any;
    name: string;
  }[] = [
    {
      path: '/',
      currentPath: '/',
      name: 'Dashboard',
      Component: <DashboardHome />,
    },
    {
      path: '/:repositoryId/*',
      currentPath: `/${repositoryId}`,
      name: `Repository: ${repositoryId}`,
      Component: <RepositoryNavigator />,
    },
    {
      path: '*',
      currentPath: '*',
      name: '404',
      Component: <PageNotFound />,
    },
  ];

  const breadcrumbRoutes: {
    path: string;
    currentPath: string;
    name: string;
  }[] = [
    {
      path: '/:repositoryId/experiments',
      currentPath: `/${repositoryId}/experiments`,
      name: 'Experiments',
    },
    {
      path: '/:repositoryId/experiments/:experimentId',
      currentPath: `/${repositoryId}/experiments/${experimentId}`,
      name: `Experiment: ${experimentId}`,
    },
  ];

  const crumbs = ([...routes, ...breadcrumbRoutes])
    .filter(({ currentPath: pathCheck }) => location.pathname.includes(pathCheck))
    .map(({ currentPath, ...rest }) => ({
      currentPath: `/dashboard${currentPath}`,
      ...rest,
    }));

  return (
    <Container sx={{ py: 5 }}>
      <Stack direction="column" spacing={4} sx={{ mt: 5 }}>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {crumbs.map(({ currentPath, name }) => (
                <Button size="small" key={currentPath} onClick={() => navigate(currentPath)}>
                  {name}
                </Button>
              ))}
            </Breadcrumbs>
          </Box>
          <Routes>
            {routes.map(({ path, Component, name }) => (
              <Route
                path={path}
                key={name}
                element={(<WrapWithSuspense component={Component} />)}
              />
            ))}
          </Routes>
        </Box>
      </Stack>
    </Container>
  );
});

export default Dashboard;
