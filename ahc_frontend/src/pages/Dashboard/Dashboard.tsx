import {
  Location, Route, Routes, useLocation, useNavigate,
} from 'react-router-dom';
import { observer } from 'mobx-react';
import {
  Box,
  Breadcrumbs, Button, Container, Stack,
} from '@mui/material';
import { useState } from 'react';
import DashboardHome from './DashboardHome';
import { useStores } from '../../stores/MainStore';
import { DashboardNavigationInterface } from '../../stores/DashboardNavigationStore';
import RepositoryNavigator from './Repository/RepositoryNavigator';
import PageNotFound from '../PageNotFound';

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

const Dashboard = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dashboardNavigationStore } = useStores();
  const initialValue = getInitialValue(location, dashboardNavigationStore);
  const [value, setValue] = useState(initialValue);

  if (initialValue !== value) setValue(initialValue);

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
  ];

  const crumbs = routes
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
              <Route path={path} key={name} element={Component} />
            ))}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Box>
      </Stack>
    </Container>
  );
});

export default Dashboard;
