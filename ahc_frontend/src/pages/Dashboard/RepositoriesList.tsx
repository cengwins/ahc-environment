import {
  Box,
  Button,
  Tooltip,
  Checkbox,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  CardActionArea,
  Stack,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RepositoryInfo } from '../../stores/RepositoriesStore';
import Loading from '../../components/Loading';
import { useStores } from '../../stores/MainStore';
import './DashboardHome.css';

const RepositoryCard = ({
  repository, navigate, chosen, onValueChange,
}:
  {repository: RepositoryInfo, navigate: any, chosen: boolean, onValueChange: any}) => (
    <Grid item md={6} xs={12}>
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardActionArea onClick={() => navigate(`/dashboard/${repository.id}`)} sx={{ height: '100%' }}>
          <CardHeader
            title={repository.name}
            action={(
              <Checkbox
                value={chosen}
                sx={{ mr: 0.5, transform: 'scale(1.3)' }}
                onClick={(e) => e.stopPropagation()}
                onChange={() => onValueChange(repository.id, !chosen)}
              />
  )}
          />
          <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography>{repository.description || 'No description'}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 'auto' }}>
              <Tooltip
                title={repository.upstream}
                sx={{ ml: 'auto', mt: 'auto' }}
              >
                <Button
                  target="_blank"
                  href={repository.upstream}
                >
                  Open in GitHub
                </Button>
              </Tooltip>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
);

const RepositoriesList = observer(({ chosens, setChosens }
  : {chosens: string[], setChosens: any}) => {
  const { repositoriesStore } = useStores();
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    repositoriesStore.getRepositories()
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Loading loading={loading} failed={failedToLoad} />

      <Grid container style={{ marginTop: 1 }} spacing={{ xs: 2, md: 3 }}>
        {repositoriesStore.repositories && repositoriesStore.repositories.map((repository) => (
          <RepositoryCard
            key={repository.id}
            repository={repository}
            navigate={navigate}
            chosen={chosens.includes(repository.id)}
            onValueChange={(id: string, value: boolean) => {
              if (value) {
                setChosens([...chosens, repository.id]);
              } else {
                setChosens(chosens.filter((curId) => curId !== repository.id));
              }
            }}
          />
        ))}
      </Grid>
      {repositoriesStore.repositories && repositoriesStore.repositories?.length === 0 && (
      <Stack direction="column" spacing={1} sx={{ mt: 5 }}>
        <Typography alignSelf="center" sx={{ color: `${blue[800]}` }} component="h2" variant="h4">
          You have no repositories.
        </Typography>
        <Typography alignSelf="center" component="h3" variant="h6">
          Add a repository to see it here.
        </Typography>
      </Stack>
      )}
    </div>
  );
});

export default RepositoriesList;
