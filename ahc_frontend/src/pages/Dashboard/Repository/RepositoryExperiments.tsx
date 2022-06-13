import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import Loading from '../../../components/Loading';
import { useStores } from '../../../stores/MainStore';
import { RepositoryInfo } from '../../../stores/RepositoriesStore';
import ExperimentStatusIcon from '../../../components/ExperimentStatusIcon';
import { ExperimentStatus } from '../../../stores/ExperimentStore';

const statuses: ExperimentStatus[] = ['pending', 'running', 'canceled', 'canceled', 'completed', 'failed'];

const RepositoryExperiments = observer(({ repository }: {repository: RepositoryInfo}) => {
  const navigate = useNavigate();
  const { experimentStore, notificationStore, userStore } = useStores();
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailed] = useState(false);
  const [runningExperiment, setRunningExperiment] = useState(false);

  const { currentExperiments: experiments } = experimentStore;

  useEffect(() => {
    experimentStore.getExperiments()
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  if (!experiments || loading) {
    return (
      <Loading loading={loading} failed={failedToLoad || !experiments} />
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <LoadingButton
        sx={{ mb: 2 }}
        loading={runningExperiment}
        variant="contained"
        disabled={runningExperiment || !userStore.activated}
        onClick={() => {
          setRunningExperiment(true);
          experimentStore.createExperiment()
            .then((result) => {
              notificationStore.set('success', 'Experiment created');

              if (result) {
                navigate(`/dashboard/${repository.id}/experiments/${result.id}`);
              }
            })
            .catch(() => notificationStore.set('error', 'Failed to create experiment'))
            .finally(() => setRunningExperiment(false));
        }}
      >
        Run Experiment
      </LoadingButton>
      <Loading loading={loading} failed={failedToLoad} />
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell variant="head">Experiment</TableCell>
              <TableCell variant="head" align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {experiments && experiments.map((experiment) => (
              <TableRow
                key={experiment.id}
                onClick={() => {
                  navigate(`/dashboard/${repository.id}/experiments/${experiment.id}`);
                }}
                className="experiment-item clickable"
              >
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <ExperimentStatusIcon status={statuses[experiment.status - 1]} />
                    <Typography sx={{ ml: 1 }}>{`Run #${experiment.sequence_id}`}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {`${new Date(experiment.updated_at).toLocaleString('tr-TR')}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
});

export default RepositoryExperiments;
