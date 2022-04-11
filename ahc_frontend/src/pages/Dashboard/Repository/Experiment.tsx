import {
  Typography, Button, Box, Tabs, Tab,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Loading from '../../../components/Loading';
import PropertyList from '../../../components/PropertyList';

import { useStores } from '../../../stores/MainStore';
import PageNotFound from '../../PageNotFound';
import '../DashboardHome.css';
import RunsAccordion from './RunsAccordion';
import ExperimentStatusIcon from '../../../components/ExperimentStatusIcon';
import { ExperimentStatus } from '../../../stores/ExperimentStore';

const statuses: ExperimentStatus[] = ['pending', 'running', 'canceled', 'canceled', 'completed'];
const Experiment = () => {
  const { experimentId } = useParams();
  const { dashboardNavigationStore, experimentStore } = useStores();
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailed] = useState(false);
  const [shownLog, setShownLog] = useState(0);

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

  const properties: {title: string, value: any}[] = [
    { title: 'Title', value: `Run #${experiment.sequence_id}` },
    { title: 'Status', value: (<ExperimentStatusIcon status={statuses[experiment.status - 1]} />) },
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

  return (
    <Box>
      <PropertyList properties={properties} />

      <Typography component="h3" variant="h4" sx={{ my: 2, color: `${blue[700]}` }}>
        Runs
      </Typography>

      <RunsAccordion runs={experiment.runs ? experiment.runs : []} />

      <Typography component="h3" variant="h4" sx={{ my: 2, color: `${blue[700]}` }}>
        Logs
      </Typography>

      <Box sx={{
        display: 'flex', mb: 2,
      }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={shownLog}
          onChange={(_, newValue: number) => setShownLog(newValue)}
          aria-label="Log tabs"
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          {experiment.runs?.map((run, i) => (
            <Tab
              key={run.sequence_id}
              label={run.sequence_id}
              id={run.id}
              value={i}
            />
          ))}
        </Tabs>
        <Box sx={{ flexGrow: 1 }}>
          {experiment.runs?.map((run, index) => (
            <div
              key={run.id}
              role="tabpanel"
              id={`vertical-tabpanel-${index}`}
              hidden={index !== shownLog}
            >
              <SyntaxHighlighter key={run.id} language="python" style={tomorrow} showLineNumbers wrapLongLines customStyle={{ height: '480px' }}>
                {run.logs}
              </SyntaxHighlighter>
              <Button variant="contained" href={run.log_url}>
                Download log
              </Button>
            </div>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Experiment;
