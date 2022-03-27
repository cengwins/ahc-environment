import { observer } from 'mobx-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import {
  Box, Card, CardContent,
} from '@mui/material';
import { RepositoryInfo } from '../../../stores/RepositoriesStore';

const RepositoryField = (title: string, value: string) => (
  <div>
    <span>{`${title}: `}</span>
    <span>{value}</span>
  </div>
);

const RepositoryHome = observer(({ repository }: {repository: RepositoryInfo}) => {
  const [readmeContent, setReadmeContent] = useState('Loading...');

  useEffect(() => {
    if (repository) {
      axios.get(`${repository.upstream.replace('github.com', 'raw.githubusercontent.com')}/main/README.md`)
        .then((response) => setReadmeContent(response.data))
        .catch(() => setReadmeContent('Failed to fetch README.md.'));
    }
  }, [repository]);

  return (
    <div>
      {RepositoryField('id', repository.id)}
      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardContent sx={{ padding: '12px 20px' }}>
          <Box>
            <ReactMarkdown>{readmeContent}</ReactMarkdown>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
});

export default RepositoryHome;
