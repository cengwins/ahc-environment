import { observer } from 'mobx-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, Typography,
} from '@mui/material';
import { GitHub } from '@mui/icons-material';
import Loading from '../../../components/Loading';
import { useStores } from '../../../stores/MainStore';

const RepositoryField = (title: string, value: string) => (
  <div>
    <span>{`${title}: `}</span>
    <span>{value}</span>
  </div>
);

const RepositoryHome = observer(() => {
  const { repositoryId } = useParams();
  const { dashboardNavigationStore, repositoriesStore } = useStores();
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailed] = useState(false);
  const [readmeContent, setReadmeContent] = useState('');

  const { currentRepository: repository } = repositoriesStore;

  useEffect(() => {
    if (repositoryId) {
      dashboardNavigationStore.setRepositoryId(repositoryId)
        .catch(() => setFailed(true))
        .finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    if (repository) {
      axios.get(`${repository.upstream.replace('github.com', 'raw.githubusercontent.com')}/main/README.md`)
        .then((response) => setReadmeContent(response.data))
        .catch(() => setReadmeContent('Failed to fetch README.md.'));
    }
  }, [repository]);

  if (!repository || failedToLoad || loading) {
    return (
      <Loading loading={loading} failed={failedToLoad || !repository} />
    );
  }

  return (
    <div>
      <Typography component="h4" variant="h6" sx={{ mt: 2 }}>
        {repository.name}
        {' '}
        <span style={{ fontFamily: 'monospace', backgroundColor: '#ddd' }}>{repository.slug}</span>
      </Typography>
      {RepositoryField('id', repository.id)}
      <Box sx={{ my: 2 }}>
        <Button variant="outlined" sx={{ mr: 2 }} href={repository.upstream} startIcon={<GitHub />}>
          View on GitHub
        </Button>
        <Button variant="outlined" sx={{ mr: 2 }} href={repository.upstream.replace('github.com', 'github.dev')} startIcon={<GitHub />}>
          Open in GitHub.dev
        </Button>
      </Box>
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
