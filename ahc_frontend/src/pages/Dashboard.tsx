import {
  Container, Nav, Stack,
} from 'react-bootstrap';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import DashboardSettings from './DashboardSettings';
import DashboardHome from './DashboardHome';
import DashboardSimulations from './DashboardSimulations';

const Dashboard = () => {
  const location = useLocation();

  console.log(location);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container className="my-5 text-start">
        <Stack direction="vertical" gap={4} className="mt-5">
          <div className="mb-4">
            <h1>AHC Dashboard</h1>
          </div>
          <div>
            <Nav fill variant="tabs" defaultActiveKey={location.pathname}>
              <Nav.Item>
                <Nav.Link href="/dashboard">Main</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/dashboard/simulation">Simulation</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/dashboard/history">History</Nav.Link>
              </Nav.Item>
            </Nav>

            <Routes>
              <Route path="" element={<DashboardHome />} />
              <Route path="/simulations" element={<DashboardSimulations />} />
              <Route path="/settings" element={<DashboardSettings />} />
            </Routes>
          </div>
        </Stack>
      </Container>
      <Footer />
    </div>
  );
};

export default Dashboard;
