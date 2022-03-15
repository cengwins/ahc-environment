import { observer } from 'mobx-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import Team from './pages/Team';
import { useStores } from './stores/MainStore';

const App = observer(() => {
  const { userStore } = useStores();
  const { token } = userStore;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
        {token && <Route path="/profile" element={<Profile />} />}
        {token && <Route path="/dashboard/*" element={<Dashboard />} />}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
});

export default App;
