import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import Loading from '../../../components/Loading';
import { useStores } from '../../../stores/MainStore';

const RepositoryExperiments = observer(() => {
  const navigate = useNavigate();
  const { repositoryId } = useParams();
  const { dashboardNavigationStore, experimentStore } = useStores();
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailed] = useState(false);
  const [runningExperiment, setRunningExperiment] = useState(false);

  const { currentExperiments: experiments } = experimentStore;

  useEffect(() => {
    const fetchFunction = async () => {
      if (repositoryId) await dashboardNavigationStore.setRepositoryId(repositoryId);
    };

    fetchFunction()
      .then(() => {
        experimentStore.getExperiments()
          .catch(() => setFailed(true))
          .finally(() => setLoading(false));
      })
      .catch(() => { setFailed(true); setLoading(false); });
  }, []);

  return (
    <div className="d-flex flex-column">
      <LoadingButton
        loading={runningExperiment}
        variant="contained"
        disabled={runningExperiment}
        onClick={() => {
          setRunningExperiment(true);
          experimentStore.createExperiment()
            .finally(() => setRunningExperiment(false));
        }}
      >
        Run Experiment
      </LoadingButton>
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
