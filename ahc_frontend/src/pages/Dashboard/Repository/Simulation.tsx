import { useState } from 'react';
import { Button, Spinner, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { useStores } from '../../../stores/MainStore';
import '../DashboardHome.css';

const metrics = [
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
];

const SimulationField = (title: string, value: string) => (
  <div>
    <span>{`${title}: `}</span>
    <span>{value}</span>
  </div>
);

const Simulation = () => {
  const { repositoryId, simulationId } = useParams();
  const { dashboardNavigationStore, repositoriesStore, experimentationsStore } = useStores();
  const [loading, setLoading] = useState(false);
  const [failedToLoad, setFailed] = useState(false);

  if (repositoryId) dashboardNavigationStore.setRepositoryId(repositoryId);
  if (simulationId) dashboardNavigationStore.setSimulationId(simulationId);

  const { currentRepository: repository } = repositoriesStore;
  const { currentExperimentation: experimentation } = experimentationsStore;

  if (!loading
    && !failedToLoad) {
    // eslint-disable-next-line eqeqeq
    if (!repository || repository.id != repositoryId) {
      setLoading(true);
      repositoriesStore.getRepository(repositoryId as string)
        .catch(() => setFailed(true))
        .finally(() => setLoading(false));
    } else if (!experimentation && simulationId) {
      setLoading(true);
      experimentationsStore.getExperiment(simulationId)
        .catch(() => setFailed(true))
        .finally(() => setLoading(false));
    }
  }

  console.log(experimentation);

  return (
    <div className="d-flex flex-column min-vh-100">
      {loading && (
      <div className="d-flex">
        <Spinner className="mx-auto my-4" animation="border" />
      </div>
      )}
      {failedToLoad && (
      <div>
        Failed to load the repository. Please try again.
      </div>
      )}
      {experimentation && (
      <>
        <h4>
          Simulation
          {' '}
          <span className="small" style={{ fontFamily: 'monospace', backgroundColor: '#ddd' }}>{experimentation.commit}</span>
        </h4>
        {SimulationField('Creation Time', `${new Date(experimentation.created_at).toLocaleDateString('tr-TR')}`)}
        {SimulationField('Update Time', `${new Date(experimentation.updated_at).toLocaleDateString('tr-TR')}`)}
        {experimentation.runs?.[0]?.started_at
          && SimulationField('Started Time', `${new Date(experimentation.runs?.[0]?.started_at).toLocaleDateString('tr-TR')}`)}
        {experimentation.runs?.[0]?.finished_at
          && SimulationField('Finished Time', `${new Date(experimentation.runs?.[0]?.finished_at).toLocaleDateString('tr-TR')}`)}
        {SimulationField('ID', experimentation.id)}
        {SimulationField('Sequence ID', `${experimentation.sequence_id}`)}
        {SimulationField('Reference', experimentation.reference)}
        {SimulationField('Reference Type', experimentation.reference_type)}

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
            {metrics.map(({ name, value, type }) => (
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
          {experimentation?.runs?.[0]?.logs && (
            <SyntaxHighlighter language="python" style={tomorrow} showLineNumbers wrapLongLines customStyle={{ height: '480px' }}>
              {experimentation?.runs?.[0]?.logs}
            </SyntaxHighlighter>
          ) }
        </div>
        <Button>
          Download logs
        </Button>
      </>
      )}
    </div>
  );
};

export default Simulation;
