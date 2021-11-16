import './App.css';
import { MainStoreProvider } from './app/MainStoreContext';

const App = () => (
  <MainStoreProvider>
    <div className="App">
      Initial
    </div>
  </MainStoreProvider>
);

export default App;
