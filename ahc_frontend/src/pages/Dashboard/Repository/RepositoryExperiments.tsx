import { observer } from 'mobx-react';
import { useState } from 'react';
import { Button, ListGroup, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../../components/Loading';
import { useStores } from '../../../stores/MainStore';

const RepositoryExperiments = observer(() => {
  const navigate = useNavigate();
  const { repositoryId } = useParams();
  const { dashboardNavigationStore, repositoriesStore, experimentStore } = useStores();
  const [loading, setLoading] = useState(false);
  const [failedToLoad, setFailed] = useState(false);
  const [runningExperiment, setRunningExperiment] = useState(false);

  if (repositoryId) dashboardNavigationStore.setRepositoryId(repositoryId);

  const { currentRepository: repository } = repositoriesStore;
  const { currentExperiments: experiments } = experimentStore;

  if (!loading && !failedToLoad) {
    // eslint-disable-next-line eqeqeq
    if (!repository || repository.id != repositoryId) {
      setLoading(true);
      repositoriesStore.getRepository(repositoryId as string)
        .catch(() => setFailed(true))
        .finally(() => setLoading(false));
    } else if (!experiments) {
      setLoading(true);
      experimentStore.getExperiments()
        .catch(() => setFailed(true))
        .finally(() => setLoading(false));
    }
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Button
        disabled={runningExperiment}
        onClick={() => {
          setRunningExperiment(true);
          experimentStore.createExperiment()
            .finally(() => setRunningExperiment(false));
        }}
      >
        {runningExperiment && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        )}
        {!runningExperiment && 'Run Experiment'}
      </Button>
      <Loading loading={loading} failed={failedToLoad} />
      <ListGroup as="ol" variant="flush" className="text-start mt-3">
        {experiments && experiments.map((experiment) => (
          <ListGroup.Item
            as="li"
            key={experiment.id}
            onClick={() => { navigate(`/dashboard/${repositoryId}/${experiment.id}`); }}
            className="repository-item clickable text-start"
          >
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <h2>{`Run #${experiment.sequence_id}`}</h2>
              <span className="small">{`(${new Date(experiment.updated_at).toLocaleDateString('tr-TR')})`}</span>
            </div>
            <div>
              <span>{experiment.commit}</span>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
});

export default RepositoryExperiments;
