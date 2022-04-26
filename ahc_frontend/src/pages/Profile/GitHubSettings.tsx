import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  TextField,
  Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { observer } from 'mobx-react';
import { useState } from 'react';
import PropertyList from '../../components/PropertyList';
import GithubStore from '../../stores/GithubStore';
import { useStores } from '../../stores/MainStore';

const GitHubSettings = observer(() => {
  const { userStore, notificationStore } = useStores();
  const [showEditToken, setShowEditToken] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);

  const properties = [
    { title: 'Username', value: userStore.username },
    {
      title: 'Set GitHub Token',
      value: (
        <Button variant="contained" onClick={() => setShowEditToken(true)}>
          Set GitHub Token
        </Button>),
    },
  ];
  return (
    <>
      <Dialog fullWidth open={showEditToken} onClose={() => setShowEditToken(false)}>
        <DialogTitle sx={{ alignSelf: 'center' }}>
          Set GitHub Token
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setWaitingResponse(true);
              GithubStore.setGithubToken({ access_token: githubToken }).then(() => {
                notificationStore.set('success', 'Token is saved!');
              }).catch((result) => {
                notificationStore.set('error', result.response.data.errors.detail || result.message);
              }).finally(() => {
                setWaitingResponse(false);
              });
            }}
          >
            <FormGroup sx={{
              mb: 2, pt: 1, display: 'flex', flexDirection: 'row',
            }}
            >
              <TextField sx={{ flexGrow: 1 }} label="GitHub Token" type="text" placeholder="Github Token" onChange={(e) => setGithubToken(e.target.value)} />
              <Button
                variant="outlined"
                sx={{ ml: 2 }}
                target="_blank"
                href="https://github.com/settings/tokens/new?description=AHC%20Experiment%20Environment&scopes=repo"
              >
                Generate
              </Button>
            </FormGroup>

            <DialogActions>
              <Button variant="contained" type="submit" disabled={waitingResponse}>
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Typography component="h2" variant="h5" sx={{ color: `${blue[700]}`, my: 2 }}>
        GitHub Integration
      </Typography>
      <PropertyList properties={properties} />
    </>
  );
});

export default GitHubSettings;
