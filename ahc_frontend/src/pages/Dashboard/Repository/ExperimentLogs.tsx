import {
  Typography, Button, Box, Tabs, Tab,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { RunInfo } from '../../../stores/ExperimentStore';

const ExperimentLogs = ({ runs } : {runs: RunInfo[]}) => {
  const [shownLog, setShownLog] = useState(0);

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

export default ExperimentLogs;
