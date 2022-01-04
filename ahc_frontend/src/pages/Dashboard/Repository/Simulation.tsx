import { Button, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { useStores } from '../../../stores/MainStore';
import '../DashboardHome.css';
import LogExample from './LogExample';

const repository = {
  name: 'Project 1',
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
  const { repositoryId, simulationId } = useParams();
  const { dashboardNavigationStore } = useStores();

  if (repositoryId) dashboardNavigationStore.setRepositoryId(repositoryId);
  if (simulationId) dashboardNavigationStore.setSimulationId(simulationId);

  return (
    <div className="d-flex flex-column min-vh-100">
      <h4>
        Simulation
        {' '}
        <span className="small" style={{ fontFamily: 'monospace', backgroundColor: '#ddd' }}>{repository.lastSimulationCommit.hash}</span>
      </h4>
      {SimulationField('Commit Message', simulation.lastSimulationCommit)}
      {SimulationField('Start Time', `${simulation.started_at.toLocaleDateString('tr-TR')}`)}
      {SimulationField('End Time', `${simulation.finished_at.toLocaleDateString('tr-TR')}`)}
      {SimulationField('Exit Code', simulation.exit_code.toString())}
      {SimulationField('Result Status', simulation.result_status)}

      <h4 className="mt-4 mb-2">Metrics</h4>
      <Table striped hover>
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
            <tr key={name}>
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

      <h4 className="mt-4 mb-2">Logs</h4>
      <div className="mb-3">
        <SyntaxHighlighter language="python" style={tomorrow} showLineNumbers wrapLongLines customStyle={{ height: '480px' }}>
          {LogExample}
        </SyntaxHighlighter>
      </div>
      <Button>
        Download logs
      </Button>
    </div>
  );
};

export default Simulation;
