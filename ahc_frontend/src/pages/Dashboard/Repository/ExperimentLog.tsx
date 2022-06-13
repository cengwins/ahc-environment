import {
  Typography, Box,
} from '@mui/material';
import { useEffect, useRef } from 'react';
import { blue } from '@mui/material/colors';
import { XTerm } from 'xterm-for-react';

const ExperimentLog = ({ logs, live } :
  { logs: string, live: boolean }) => {
  const xtermRef = useRef(null);

  useEffect(() => {
    if (xtermRef.current) {
      const term = (xtermRef.current as any).terminal;
      term.clear();
      logs.split('\n').forEach(async (line) => {
        if (live) {
          term.writeln(line, () => { term.scrollToBottom(); });
        } else {
          term.writeln(line, () => { term.scrollToTop(); });
        }
      });
      term.element.style.padding = '16px';
    }
  }, [logs]);

  if (!logs || logs.length === 0) return <div />;

  return (
    <Box sx={{ mb: 2 }}>
      {live && (
      <Typography component="h3" variant="h4" sx={{ my: 2, color: `${blue[700]}` }}>
        Live Logs
      </Typography>
      )}

      <Box sx={{ flexGrow: 1 }}>
        <XTerm ref={xtermRef} options={{ windowsMode: true }} />
      </Box>
    </Box>
  );
};

export default ExperimentLog;
