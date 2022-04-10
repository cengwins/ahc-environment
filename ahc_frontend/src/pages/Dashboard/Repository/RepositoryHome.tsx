import { observer } from 'mobx-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import {
  Box, Card, CardContent, Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { RepositoryInfo } from '../../../stores/RepositoriesStore';
import PropertyList from '../../../components/PropertyList';

const RepositoryHome = observer(({ repository }: {repository: RepositoryInfo}) => {
  const [readmeContent, setReadmeContent] = useState('Loading...');

  useEffect(() => {
    if (repository.upstream) {
      axios.get(`${repository.upstream.replace('github.com', 'raw.githubusercontent.com')}/main/README.md`)
        .then((response) => setReadmeContent(response.data))
        .catch(() => setReadmeContent('Failed to fetch README.md.'));
    }
  }, [repository]);

  const properties = [
    { title: 'Name', value: repository.name },
    { title: 'Description', value: repository.description || 'None' },
    { title: 'Identifier', value: repository.id },
    { title: 'Upstream', value: repository.upstream },
  ];

  return (
    <div>
      <PropertyList properties={properties} />
      <Typography component="h3" variant="h4" sx={{ my: 2, color: `${blue[700]}` }}>README</Typography>
      <Card variant="outlined" sx={{ my: 2 }}>
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
