import {
  Location, Route, Routes, useLocation, useNavigate,
} from 'react-router-dom';
import { observer } from 'mobx-react';
import {
  Breadcrumbs, Button, Container, Stack, Tab, Tabs,
} from '@mui/material';
import { useState } from 'react';
import DashboardSettings from './DashboardSettings';
import DashboardHome from './DashboardHome';
import RepositoryExperiments from './Repository/RepositoryExperiments';
import Experiment from './Repository/Experiment';
import RepositoryHome from './Repository/RepositoryHome';
import { useStores } from '../../stores/MainStore';
import { DashboardNavigationInterface } from '../../stores/DashboardNavigationStore';

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
      path: '/settings',
      currentPath: '/settings',
      name: 'Settings',
      Component: <DashboardSettings />,
    },
    {
      path: '/:repositoryId',
      currentPath: `/${dashboardNavigationStore.repositoryId}`,
      name: `Repository: ${dashboardNavigationStore.repositoryId}`,
      Component: <RepositoryHome />,
    },
    {
      path: '/:repositoryId/experiments',
      currentPath: `/${dashboardNavigationStore.repositoryId}/experiments`,
      name: 'Experiments',
      Component: <RepositoryExperiments />,
    },
    {
      path: '/:repositoryId/:experimentId',
      currentPath: `/${dashboardNavigationStore.repositoryId}/${dashboardNavigationStore.experimentId}`,
      name: `Experiment: ${dashboardNavigationStore.experimentId}`,
      Component: <Experiment />,
    },
  ];

  const crumbs = routes
    .filter(({ currentPath: pathCheck }) => location.pathname.includes(pathCheck))
    .map(({ currentPath, ...rest }) => ({
      currentPath: `/dashboard${currentPath}`,
      ...rest,
    }));

  return (
    <Container className="my-5 text-start">
      <Stack direction="column" spacing={4} className="mt-5">
        <div>
          <div className="mb-3">
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {crumbs.map(({ currentPath, name }) => (
                <Button size="small" key={currentPath} onClick={() => navigate(currentPath)}>
                  {name}
                </Button>
              ))}
            </Breadcrumbs>
          </div>

          {!location.pathname.startsWith(`/dashboard/${dashboardNavigationStore.repositoryId}`) && (
          <Tabs
            sx={{ mb: 2 }}
            variant="fullWidth"
            value={value}
            onChange={(_, val) => {
              setValue(val);
              if (val === 0) navigate('/dashboard');
              else navigate('/dashboard/settings');
            }}
            aria-label="basic tabs example"
          >
            <Tab label="Repositories" id="simple-tab-0" />
            <Tab label="Settings" id="simple-tab-1" />
          </Tabs>
          )}

          {location.pathname.startsWith(`/dashboard/${dashboardNavigationStore.repositoryId}`) && (
          <Tabs
            sx={{ mb: 2 }}
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
          )}

          <Routes>
            {routes.map(({ path, Component, name }) => (
              <Route path={path} key={name} element={Component} />
            ))}
          </Routes>
        </div>
      </Stack>
    </Container>
  );
});

export default Dashboard;
