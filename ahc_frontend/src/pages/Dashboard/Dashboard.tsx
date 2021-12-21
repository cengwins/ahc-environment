import {
  Container, Nav, Stack,
} from 'react-bootstrap';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import DashboardSettings from './DashboardSettings';
import DashboardHome from './DashboardHome';
import Project from './Project/Project';

const Dashboard = () => {
  const location = useLocation();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container className="my-5 text-start">
        <Stack direction="vertical" gap={4} className="mt-5">
          <div>
            {!location.pathname.startsWith('/dashboard/project') && (
              <Nav className="mb-3" fill variant="tabs" defaultActiveKey={location.pathname}>
                <Nav.Item>
                  <Nav.Link href="/dashboard">Projects</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/dashboard/settings">Settings</Nav.Link>
                </Nav.Item>
              </Nav>
            )}

            <Routes>
              <Route path="" element={<DashboardHome />} />
              {/* <Route path="/simulations" element={<DashboardProject />} /> */}
              <Route path="/settings" element={<DashboardSettings />} />
              <Route path="/project*" element={<Project />} />
            </Routes>
          </div>
        </Stack>
      </Container>
      <Footer />
    </div>
  );
};

export default Dashboard;
