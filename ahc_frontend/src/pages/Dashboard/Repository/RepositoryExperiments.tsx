import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
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
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <LoadingButton
        sx={{ mb: 2 }}
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
                onClick={() => { navigate(`/dashboard/${repositoryId}/${experiment.id}`); }}
                className="experiment-item clickable"
              >
                <TableCell>
                  {`Run #${experiment.sequence_id}`}
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
