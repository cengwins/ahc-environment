import {
  Typography, Box,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const LiveExperimentLogs = ({ tempLogs } : { tempLogs: string }) => {
  if (!tempLogs || tempLogs.length === 0) return <div />;

  return (
    <Box>
      <Typography component="h3" variant="h4" sx={{ my: 2, color: `${blue[700]}` }}>
        Live Logs
      </Typography>

      <Box sx={{
        display: 'flex', mb: 2,
      }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <SyntaxHighlighter key="templogs" language="shell" style={tomorrow} showLineNumbers wrapLongLines customStyle={{ height: '480px', width: '1200px' }}>
            {tempLogs}
          </SyntaxHighlighter>
        </Box>
      </Box>
    </Box>
  );
};

export default LiveExperimentLogs;
