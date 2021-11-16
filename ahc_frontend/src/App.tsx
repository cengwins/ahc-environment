import { Button, Card } from 'react-bootstrap';
import './App.css';
import { MainStoreProvider } from './app/MainStoreContext';

const App = () => (
  <MainStoreProvider>
    <div className="App">
      <Card>
        <Card.Header>
          Header
        </Card.Header>
        <Card.Body>
          <div>
            Body
          </div>
          <Button>
            Hello
          </Button>
        </Card.Body>
      </Card>
    </div>
  </MainStoreProvider>
);

export default App;
