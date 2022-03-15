import {
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
import { observer } from 'mobx-react';
import { useState } from 'react';
import Loading from '../../components/Loading';
import { useStores } from '../../stores/MainStore';
import './DashboardHome.css';
import RepositoriesList from './RepositoriesList';

const DashboardHome = observer(() => {
  const { githubStore, repositoriesStore } = useStores();
  const [searchString, setSearchString] = useState('');
  const [show, setShow] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);

  const handleStringSearch = (e: any) => {
    const currentSearchString = e.target.value;
    setSearchString(currentSearchString);
    if (currentSearchString.length >= 3
      && githubStore.currentSearchString !== currentSearchString) {
      setSearching(true);
      setSearchFailed(false);
      githubStore.getGithubRepos(currentSearchString)
        .catch(() => {
          if (currentSearchString === e.target.value) {
            setSearchFailed(true);
          }
        }).finally(() => {
          if (currentSearchString === e.target.value) {
            setSearching(false);
          }
        });
    }
    repositoriesStore.getRepositories();
  };

  return (
    <>
      <Dialog fullWidth open={show} onClose={() => setShow(false)}>
        <DialogTitle>
          Add a repository from GitHub.
        </DialogTitle>

        <DialogContent>
          <form>
            <FormGroup sx={{ mb: 2, pt: 1 }}>
              <TextField type="text" label="Repository Name" placeholder="Repository Name" onChange={handleStringSearch} />
            </FormGroup>
          </form>

          {searchString && searchString.length < 3 && (
          <span className="small">
            Please enter at least 3 characters to start searching.
          </span>
          )}
          <div className="w-100">
            <Loading loading={searching} failed={searchFailed} />
          </div>
          {!searching && !searchFailed
          && (
          <div>
            {searchString && searchString.length >= 3 && githubStore.userRepos.length === 0 && (
              <span>
                There are no repositories with the given name.
              </span>
            )}
            <List className="text-start mt-3">
              {githubStore.userRepos.map((repository) => (
                <ListItem
                  key={repository.full_name}
                  className="repository-item text-start"
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
                          );
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

      <div className="d-flex flex-column min-vh-100">
        <div className="d-flex flex-row">
          <Button color="error" variant="contained" className="ms-auto" onClick={() => setShow(true)}>
            Delete
          </Button>
          <Button variant="contained" className="ms-2" onClick={() => setShow(true)}>
            Add Repository
          </Button>
        </div>

        <RepositoriesList />
      </div>
    </>
  );
});

export default DashboardHome;
