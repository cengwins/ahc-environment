import './App.css';
import { MainStoreProvider } from './app/MainStoreContext';

function App() {
  return (
    <MainStoreProvider>
      <div className="App">
      </div>
    </MainStoreProvider>
  );
}

export default App;
