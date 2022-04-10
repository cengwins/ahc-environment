import { observer } from 'mobx-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card, CardContent, Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { RepositoryInfo } from '../../../stores/RepositoriesStore';

const RepositoryConfig = observer(({ repository }: {repository: RepositoryInfo}) => {
  const [ahcymlContent, setAhcymlContent] = useState('Loading...');

  useEffect(() => {
    if (repository.upstream) {
      axios.get(`${repository.upstream.replace('github.com', 'raw.githubusercontent.com')}/main/ahc.yml`)
        .then((response) => setAhcymlContent(response.data))
        .catch(() => {
          axios.get(`${repository.upstream.replace('github.com', 'raw.githubusercontent.com')}/main/.ahc.yml`)
            .then((response) => setAhcymlContent(response.data))
            .catch(() => setAhcymlContent('Failed to fetch ahc.yml or .ahc.yml.'));
        });
    }
  }, [repository]);

  return (
    <div>
      <Typography component="h3" variant="h4" sx={{ my: 2, color: `${blue[700]}` }}>ahc.yml</Typography>
      <Card variant="outlined" sx={{ my: 2, backgroundColor: '#FDFCFD' }}>
        <CardContent sx={{ padding: '12px 20px' }}>
          <SyntaxHighlighter
            language="yaml"
            style={coy}
            wrapLongLines
            showLineNumbers
          >
            {ahcymlContent}
          </SyntaxHighlighter>
        </CardContent>
      </Card>
    </div>
  );
});

export default RepositoryConfig;
