import { observer } from 'mobx-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import {
  Box, Card, CardContent, Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { RepositoryInfo } from '../../../stores/RepositoriesStore';

const RepositoryConfig = observer(({ repository }: {repository: RepositoryInfo}) => {
  const [ahcymlContent, setAhcymlContent] = useState('Loading...');

  useEffect(() => {
    if (repository.upstream) {
      axios.get(`${repository.upstream.replace('github.com', 'raw.githubusercontent.com')}/main/ahc.yml`)
        .then((response) => setAhcymlContent(response.data))
        .catch(() => setAhcymlContent('Failed to fetch ahc.yml.'));
    }
  }, [repository]);

  return (
    <div>
      <Typography component="h3" variant="h4" sx={{ my: 2, color: `${blue[700]}` }}>ahc.yml</Typography>
      <Card variant="outlined" sx={{ my: 2 }}>
        <CardContent sx={{ padding: '12px 20px' }}>
          <Box>
            <ReactMarkdown>{ahcymlContent}</ReactMarkdown>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
});

export default RepositoryConfig;
