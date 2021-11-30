import { useObserver } from 'mobx-react';
import {
  BrowserRouter,
  Routes, // instead of "Switch"
  Route,
} from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Team from './pages/Team';
import { useStores } from './stores/MainStore';

const App = () => {
  const { userStore } = useStores();
  const { username } = userStore;

  return useObserver(() => (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
        {!username && <Route path="/login" element={<Login />} />}
        {!username && <Route path="/register" element={<Register />} />}
        {username && <Route path="/profile" element={<Profile />} />}
        {username && <Route path="/dashboard" element={<Dashboard />} />}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  ));
};

export default App;
