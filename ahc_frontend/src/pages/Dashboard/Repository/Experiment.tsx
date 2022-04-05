import {
  List, ListItem, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Box,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Loading from '../../../components/Loading';

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

const ExperimentField = (title: string, value: string) => (
  <ListItem>
    <Typography sx={{ mr: 1, fontWeight: 700 }}>{`${title}:`}</Typography>
    <Typography>{value}</Typography>
  </ListItem>
);

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

  return (
    <Box>
      <Typography component="h2" variant="h5">
        Experiment
        {' '}
        <Typography sx={{ fontFamily: 'monospace', backgroundColor: '#ddd' }}>{experiment.commit}</Typography>
      </Typography>
      <List>
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
      </List>

      <Typography component="h2" variant="h5">
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
      <Button variant="contained" sx={{ my: 2 }}>
        Download .csv
      </Button>

      <Typography component="h2" variant="h5">
        Logs
      </Typography>

      <Box sx={{ mb: 2 }}>
        {experiment?.runs?.[0]?.logs && (
        <SyntaxHighlighter language="python" style={tomorrow} showLineNumbers wrapLongLines customStyle={{ height: '480px' }}>
          {experiment?.runs?.[0]?.logs}
        </SyntaxHighlighter>
        ) }
      </Box>
      <Button variant="contained">
        Download logs
      </Button>
    </Box>
  );
};

export default Experiment;
