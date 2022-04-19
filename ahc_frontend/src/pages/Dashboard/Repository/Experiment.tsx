import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import Loading from '../../../components/Loading';
import PropertyList from '../../../components/PropertyList';

import { useStores } from '../../../stores/MainStore';
import PageNotFound from '../../PageNotFound';
import '../DashboardHome.css';
import RunsAccordion from './RunsAccordion';
import ExperimentStatusIcon from '../../../components/ExperimentStatusIcon';
import { ExperimentStatus } from '../../../stores/ExperimentStore';
import ExperimentLogs from './ExperimentLogs';

const statuses: ExperimentStatus[] = ['pending', 'running', 'canceled', 'canceled', 'completed', 'failed'];
const Experiment = () => {
  const { experimentId } = useParams();
  const { dashboardNavigationStore, experimentStore } = useStores();
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailed] = useState(false);

  useEffect(() => {
    const fetchFunction = async () => {
      if (experimentId) await dashboardNavigationStore.setExperimentId(experimentId);
    };

    fetchFunction()
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  const { currentExperiment: experiment } = experimentStore;

  if (!experiment && failedToLoad) {
    return (<PageNotFound />);
  }

  if (!experiment || loading) {
    return (
      <Loading loading={loading} failed={failedToLoad || !experiment} />
    );
  }

  if (!experiment || loading) {
    return (
      <Loading loading={loading} failed={failedToLoad || !experiment} />
    );
  }

  const experimentStatus = statuses[experiment.status - 1];

  const properties: {title: string, value: any}[] = [
    { title: 'Title', value: `Run #${experiment.sequence_id}` },
    { title: 'Status', value: (<ExperimentStatusIcon status={experimentStatus} />) },
    {
      title: 'Creation Time',
      value: `${new Date(experiment.created_at).toLocaleDateString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}`,
    },
    {
      title: 'Update Time',
      value: `${new Date(experiment.updated_at).toLocaleDateString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}`,
    },
    { title: 'Reference', value: experiment.reference },
    { title: 'Reference Type', value: experiment.reference_type },
  ];

  const experimentNotFinished = experimentStatus === 'running' || experimentStatus === 'pending';

  return (
    <Box>
      <PropertyList properties={properties} />

      {experimentNotFinished && (
      <Stack sx={{ mt: 3 }}>
        <Typography alignSelf="center" sx={{ mb: 2, color: `${blue[700]}` }} component="h4" variant="h5">
          Your experiment is not yet finished.
        </Typography>
        <Typography alignSelf="center" sx={{ color: `${blue[600]}` }} component="h2" variant="subtitle1">
          You will see the details of the runs when it is done here.
        </Typography>
        <Typography alignSelf="center" sx={{ color: `${blue[600]}` }} component="h2" variant="subtitle1">
          Refresh the page to see the current state of the experiment.
        </Typography>
      </Stack>
      )}

      {!experimentNotFinished && (
      <Box>
        <RunsAccordion runs={experiment.runs ? experiment.runs : []} />
        <ExperimentLogs runs={experiment.runs || []} />
      </Box>
      )}
    </Box>
  );
};

export default Experiment;
