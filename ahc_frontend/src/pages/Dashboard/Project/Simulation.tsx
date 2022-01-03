import { Button, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useStores } from '../../../stores/MainStore';
import '../DashboardHome.css';

const project = {
  projectName: 'Project 1',
  githubPath: 'ucanyiit/532',
  branch: 'main',
  lastSimulationCommit: {
    message: 'Implemented error detection and correction mechanism',
    hash: 'ef9febd0',
  },
  lastSimulationDate: new Date(),
};

const simulation = {
  lastSimulationCommit: 'Fixed bug on connecting nodes',
  started_at: new Date(),
  finished_at: new Date(),
  exit_code: 1,
  result_status: 'Done',
  details: {
    timeTook: 42,
  },
  metrics: [
    {
      name: 'Node count',
      type: 'int',
      value: 23,
    },
    {
      name: 'Throughput',
      type: 'float',
      value: 0.23,
    },
    {
      name: 'Metric 3',
      type: 'float',
      value: 5325.23,
    },
    {
      name: 'Total Messages',
      type: 'int',
      value: 921,
    },
    {
      name: 'Failed Messages',
      type: 'int',
      value: 9,
    },
  ],
};

const SimulationField = (title: string, value: string) => (
  <div>
    <span>{`${title}: `}</span>
    <span>{value}</span>
  </div>
);

const Simulation = () => {
  const { projectId, simulationId } = useParams();
  const { dashboardNavigationStore } = useStores();

  if (projectId) dashboardNavigationStore.setProjectId(projectId);
  if (simulationId) dashboardNavigationStore.setSimulationId(simulationId);

  return (
    <div className="d-flex flex-column min-vh-100">
      <h4>
        Simulation
        {' '}
        <span className="small" style={{ fontFamily: 'monospace', backgroundColor: '#ddd' }}>{project.lastSimulationCommit.hash}</span>
      </h4>
      {SimulationField('Commit Message', simulation.lastSimulationCommit)}
      {SimulationField('Start Time', `${simulation.started_at.toLocaleDateString('tr-TR')}`)}
      {SimulationField('End Time', `${simulation.finished_at.toLocaleDateString('tr-TR')}`)}
      {SimulationField('Exit Code', simulation.exit_code.toString())}
      {SimulationField('Result Status', simulation.result_status)}

      <Table striped hover className="mt-4">
        <thead>
          <tr>
            <th>Metric Name</th>
            <th>Value</th>
            <th>Type</th>
            <th>Created at?</th>
          </tr>
        </thead>
        <tbody>
          {simulation.metrics.map(({ name, value, type }) => (
            <tr>
              <td>{name}</td>
              <td>{value}</td>
              <td>{type}</td>
              <td>..</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button>
        Download .csv
      </Button>
    </div>
  );
};

export default Simulation;
