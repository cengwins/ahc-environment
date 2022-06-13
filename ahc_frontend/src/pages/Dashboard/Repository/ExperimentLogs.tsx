import {
  Typography, Button, Box, Tabs, Tab,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { useState } from 'react';
import { RunInfo } from '../../../stores/ExperimentStore';
import ExperimentLog from './ExperimentLog';

const ExperimentLogs = ({ runs } : {runs: RunInfo[]}) => {
  const [shownLog, setShownLog] = useState(0);

  if (runs.length === 0) return <div />;

  return (
    <Box>
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
          {runs.map((run, i) => (
            <Tab
              key={run.sequence_id}
              label={run.sequence_id}
              id={run.id}
              value={i}
            />
          ))}
        </Tabs>
        <Box sx={{ flexGrow: 1 }}>
          {runs.map((run, index) => (
            <div
              key={run.id}
              role="tabpanel"
              id={`vertical-tabpanel-${index}`}
              hidden={index !== shownLog}
              style={{ maxWidth: '100%' }}
            >
              <ExperimentLog tempLogs={run.logs} live={false} />
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

export default ExperimentLogs;
