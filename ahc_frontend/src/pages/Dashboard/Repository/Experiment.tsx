import { TabPanel } from '@mui/lab';
import {
  Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Box, Tabs, Tab,
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

  const properties: {title: string, value: any}[] = [
    { title: 'Creation Time', value: `${new Date(experiment.created_at).toLocaleDateString('tr-TR')}` },
    { title: 'Update Time', value: `${new Date(experiment.updated_at).toLocaleDateString('tr-TR')}` },
    { title: 'ID', value: experiment.id },
    { title: 'Sequence ID', value: `${experiment.sequence_id}` },
    { title: 'Reference', value: experiment.reference },
    { title: 'Reference Type', value: experiment.reference_type },
  ];

  if (!experiment || loading) {
    return (
      <Loading loading={loading} failed={failedToLoad || !experiment} />
    );
  }

  return (
    <Box>
      <PropertyList properties={properties} />

      <Typography component="h3" variant="h4" sx={{ my: 2, color: `${blue[700]}` }}>
        Metrics
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Metric Name</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Created at?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {metrics.map(({ name, value, type }) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell>{value}</TableCell>
              <TableCell>{type}</TableCell>
              <TableCell>..</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography component="h3" variant="h4" sx={{ my: 2, color: `${blue[700]}` }}>
        Logs
      </Typography>

      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={shownLog}
        onChange={(_, newValue: number) => setShownLog(newValue)}
        aria-label="Log tabs"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        {experiment.runs?.map((run) => (
          <Tab label={run.sequence_id} id={run.id} />
        ))}
      </Tabs>
      <Box sx={{ mb: 2 }}>
        {experiment.runs?.map((run, i) => (
          <TabPanel key={run.id} value={`${i}`}>
            <SyntaxHighlighter key={run.id} language="python" style={tomorrow} showLineNumbers wrapLongLines customStyle={{ height: '480px' }}>
              {run.logs}
            </SyntaxHighlighter>
          </TabPanel>
        ))}
      </Box>
      <Button variant="contained">
        Download logs
      </Button>
    </Box>
  );
};

export default Experiment;
