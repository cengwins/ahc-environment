import {
  Breadcrumb,
  Container, Nav, Stack,
} from 'react-bootstrap';
import {
  Route, Routes, useLocation,
} from 'react-router-dom';
import { observer } from 'mobx-react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import DashboardSettings from './DashboardSettings';
import DashboardHome from './DashboardHome';
import RepositoryExperiments from './Repository/RepositoryExperiments';
import Experiment from './Repository/Experiment';
import RepositoryHome from './Repository/RepositoryHome';
import { useStores } from '../../stores/MainStore';

const Dashboard = observer(() => {
  const location = useLocation();
  const { dashboardNavigationStore } = useStores();

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
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container className="my-5 text-start">
        <Stack direction="vertical" gap={4} className="mt-5">
          <div>
            <Breadcrumb>
              {crumbs.map(({ currentPath, name }) => (
                <Breadcrumb.Item key={currentPath} href={currentPath}>
                  {name}
                </Breadcrumb.Item>
              ))}

            </Breadcrumb>
            {!location.pathname.startsWith(`/dashboard/${dashboardNavigationStore.repositoryId}`) && (
              <Nav className="mb-3" fill variant="tabs" defaultActiveKey={location.pathname}>
                <Nav.Item>
                  <Nav.Link href="/dashboard">Repositories</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/dashboard/settings">Settings</Nav.Link>
                </Nav.Item>
              </Nav>
            )}

            {location.pathname.startsWith(`/dashboard/${dashboardNavigationStore.repositoryId}`) && (
            <Nav className="mb-3" fill variant="tabs" defaultActiveKey={location.pathname}>
              <Nav.Item>
                <Nav.Link href={`/dashboard/${dashboardNavigationStore.repositoryId}`}>Overview</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href={`/dashboard/${dashboardNavigationStore.repositoryId}/experiments`}>Experiments</Nav.Link>
              </Nav.Item>
            </Nav>
            )}

            <Routes>
              {routes.map(({ path, Component, name }) => (
                <Route path={path} key={name} element={Component} />
              ))}
            </Routes>
          </div>
        </Stack>
      </Container>
      <Footer />
    </div>
  );
});

export default Dashboard;
