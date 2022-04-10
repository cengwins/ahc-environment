import {
  Route, Routes, useLocation, useNavigate,
} from 'react-router-dom';
import { observer } from 'mobx-react';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Link,
  Container,
  Stack,
} from '@mui/material';
import { lazy } from 'react';
import { useStores } from '../../stores/MainStore';
import WrapWithSuspense from '../../utils/WrapWithSuspense';

const DashboardHome = lazy(() => import('./DashboardHome'));
const RepositoryNavigator = lazy(() => import('./Repository/RepositoryNavigator'));
const PageNotFound = lazy(() => import('../PageNotFound'));

const Dashboard = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dashboardNavigationStore, userStore } = useStores();

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
      currentPath: `/${dashboardNavigationStore.repositoryId}`,
      name: `Repository: ${dashboardNavigationStore.repositoryId}`,
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
      currentPath: `/${dashboardNavigationStore.repositoryId}/experiments`,
      name: 'Experiments',
    },
    {
      path: '/:repositoryId/:experimentId',
      currentPath: `/${dashboardNavigationStore.repositoryId}/${dashboardNavigationStore.experimentId}`,
      name: `Experiment: ${dashboardNavigationStore.experimentId}`,
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
          {!userStore.activated && (
          <Alert sx={{ mb: 2 }} severity="error">
            {'Your account is not yet activated. Please '}
            <Link href="mailto:ahc@ceng.metu.edu.tr">
              send a mail
            </Link>
            {' if your account is not activated after some time.'}
          </Alert>
          )}
          <Routes>
            {userStore.activated && (routes.map(({ path, Component, name }) => (
              <Route
                path={path}
                key={name}
                element={(<WrapWithSuspense component={Component} />)}
              />
            )))}
          </Routes>
        </Box>
      </Stack>
    </Container>
  );
});

export default Dashboard;
