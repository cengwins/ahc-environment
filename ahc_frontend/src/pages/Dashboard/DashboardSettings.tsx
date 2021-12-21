import { Button } from 'react-bootstrap';

const DashboardSettings = () => (
  <div className="d-flex flex-column min-vh-100">
    <div>
      <h4>
        Github Account:
        {' '}
        <a href="https://github.com/ucanyiit">ucanyiit</a>
      </h4>
      <Button>Replace</Button>
    </div>
  </div>
);

export default DashboardSettings;
