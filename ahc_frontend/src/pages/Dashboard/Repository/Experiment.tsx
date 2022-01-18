import { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Loading from '../../../components/Loading';

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

const ExperimentField = (title: string, value: string) => (
  <div>
    <span>{`${title}: `}</span>
    <span>{value}</span>
  </div>
);

const Experiment = () => {
  const { repositoryId, experimentId } = useParams();
  const { dashboardNavigationStore, repositoriesStore, experimentStore } = useStores();
  const [loading, setLoading] = useState(false);
  const [failedToLoad, setFailed] = useState(false);

  if (repositoryId) dashboardNavigationStore.setRepositoryId(repositoryId);
  if (experimentId) dashboardNavigationStore.setExperimentId(experimentId);

  const { currentRepository: repository } = repositoriesStore;
  const { currentExperiment: experiment } = experimentStore;

  if (!loading && !failedToLoad) {
    // eslint-disable-next-line eqeqeq
    if (repository?.id != repositoryId) {
      setLoading(true);
      repositoriesStore.getRepository(repositoryId as string)
        .catch(() => setFailed(true))
        .finally(() => setLoading(false));
    // eslint-disable-next-line eqeqeq
    } else if (experiment?.id != experimentId) {
      setLoading(true);
      experimentStore.getExperiment(experimentId as string)
        .catch(() => setFailed(true))
        .finally(() => setLoading(false));
    }
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Loading loading={loading} failed={failedToLoad} />
      {experiment && (
      <>
        <h4>
          Experiment
          {' '}
          <span className="small" style={{ fontFamily: 'monospace', backgroundColor: '#ddd' }}>{experiment.commit}</span>
        </h4>
        {ExperimentField('Creation Time', `${new Date(experiment.created_at).toLocaleDateString('tr-TR')}`)}
        {ExperimentField('Update Time', `${new Date(experiment.updated_at).toLocaleDateString('tr-TR')}`)}
        {experiment.runs?.[0]?.started_at
          && ExperimentField('Started Time', `${new Date(experiment.runs?.[0]?.started_at).toLocaleDateString('tr-TR')}`)}
        {experiment.runs?.[0]?.finished_at
          && ExperimentField('Finished Time', `${new Date(experiment.runs?.[0]?.finished_at).toLocaleDateString('tr-TR')}`)}
        {ExperimentField('ID', experiment.id)}
        {ExperimentField('Sequence ID', `${experiment.sequence_id}`)}
        {ExperimentField('Reference', experiment.reference)}
        {ExperimentField('Reference Type', experiment.reference_type)}

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
          {experiment?.runs?.[0]?.logs && (
            <SyntaxHighlighter language="python" style={tomorrow} showLineNumbers wrapLongLines customStyle={{ height: '480px' }}>
              {experiment?.runs?.[0]?.logs}
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

export default Experiment;
