import { observer } from 'mobx-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { Button, Card, CardContent } from '@mui/material';
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
      <div className="d-flex flex-column min-vh-100">
        <Loading loading={loading} failed={failedToLoad || !repository} />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <h4>
        {repository.name}
        {' '}
        <span className="small" style={{ fontFamily: 'monospace', backgroundColor: '#ddd' }}>{repository.slug}</span>
      </h4>
      {RepositoryField('id', repository.id)}
      <div className="my-2">
        <Button variant="outlined" className="me-2" href={repository.upstream} startIcon={<GitHub />}>
          View on GitHub
        </Button>
        <Button variant="outlined" className="me-2" href={repository.upstream.replace('github.com', 'github.dev')} startIcon={<GitHub />}>
          Open in GitHub.dev
        </Button>
      </div>
      <Card variant="outlined" className="mt-4">
        <CardContent sx={{ padding: '12px 20px' }}>
          <ReactMarkdown>{readmeContent}</ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
});

export default RepositoryHome;
