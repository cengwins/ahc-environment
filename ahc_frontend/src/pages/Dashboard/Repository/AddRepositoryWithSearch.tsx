import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormGroup,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { useDebouncedValue } from '@mantine/hooks';
import { observer } from 'mobx-react';
import { useState, useEffect } from 'react';
import Loading from '../../../components/Loading';
import { useStores } from '../../../stores/MainStore';

const AddRepositoryWithSearchDialog = observer((
  { show, setShow, setManual }: {show: boolean, setShow: any, setManual: any},
) => {
  const { githubStore, repositoriesStore, notificationStore } = useStores();
  const [searchString, setSearchString] = useState('');
  const [debouncedSearchString] = useDebouncedValue(searchString, 500);
  const [searching, setSearching] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);

  useEffect(() => {
    if (debouncedSearchString.length >= 3) {
      setSearching(true);
      setSearchFailed(false);
      githubStore.getGithubRepos(debouncedSearchString)
        .then(() => repositoriesStore.getRepositories())
        .catch(() => {
          if (githubStore.currentSearchString === debouncedSearchString) {
            setSearchFailed(true);
          }
        }).finally(() => {
          if (githubStore.currentSearchString === debouncedSearchString) {
            setSearching(false);
          }
        });
    }
  }, [debouncedSearchString]);

  return (
    <Dialog fullWidth open={show} onClose={() => setShow(false)}>
      <DialogTitle>
        <Typography variant="h5">
          You can search your GitHub repositories below
        </Typography>
        <Button fullWidth={false} size="small" onClick={() => setManual()}>
          Add Manually
        </Button>
      </DialogTitle>

      <DialogContent>
        <form>
          <FormGroup sx={{ mb: 2, pt: 1 }}>
            <TextField type="text" label="Repository Name" placeholder="Repository Name" onChange={(e) => setSearchString(e.target.value)} />
          </FormGroup>
        </form>

        {debouncedSearchString && debouncedSearchString.length < 3 && (
          <Typography>
            Please enter at least 3 characters to start searching.
          </Typography>
        )}
        <Box sx={{ width: '100%' }}>
          <Loading loading={searching} failed={searchFailed} />
        </Box>
        {!searching && !searchFailed && debouncedSearchString.length >= 3 && (
          <div>
            <Typography>
              {`Results for: ${debouncedSearchString}`}
            </Typography>
            {debouncedSearchString
            && debouncedSearchString.length >= 3
            && githubStore.userRepos.length === 0 && (
              <Typography>
                There are no repositories with the given name.
              </Typography>
            )}
            <List>
              {githubStore.userRepos.map((repository) => (
                <ListItem
                  key={repository.id}
                  className="repository-item"
                >
                  <div style={{ display: 'block', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Link underline="hover" href={repository.html_url} target="_blank" rel="noreferrer">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="h5" sx={{ color: 'secondary' }}>{repository.name}</Typography>
                          <Typography variant="subtitle1" sx={{ fontSize: 'small' }}>
                            {repository.html_url}
                          </Typography>
                        </div>
                      </Link>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          repositoriesStore.createRepository(
                            { name: repository.name, upstream: repository.html_url },
                          )
                            .then(() => {
                              notificationStore.set('success', 'Repository is successfully added.');
                              setShow(false);
                            })
                            .catch(() => notificationStore.set('error', 'Failed to add the repository.'));
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});

export default AddRepositoryWithSearchDialog;
