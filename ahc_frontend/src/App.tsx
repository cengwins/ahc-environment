import {
  BrowserRouter,
  Routes, // instead of "Switch"
  Route,
} from 'react-router-dom';
import './App.css';
import { MainStoreProvider } from './app/MainStoreContext';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import Team from './pages/Team';

const App = () => (
  <MainStoreProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  </MainStoreProvider>
);

export default App;
