import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { observer } from 'mobx-react';
import { useState } from 'react';
import GithubStore from '../../stores/GithubStore';
import { useStores } from '../../stores/MainStore';
import ProfileField from './ProfileField';

const GitHubSettings = observer(() => {
  const { userStore, notificationStore } = useStores();
  const [showEditToken, setShowEditToken] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);

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
                notificationStore.set('error', result.message);
              }).finally(() => {
                setWaitingResponse(false);
              });
            }}
          >
            <FormGroup sx={{ mb: 2, pt: 1 }}>
              <TextField label="GitHub Token" type="text" placeholder="Github Token" onChange={(e) => setGithubToken(e.target.value)} />
            </FormGroup>

            <DialogActions>
              <Button variant="contained" type="submit" disabled={waitingResponse}>
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <>
        <Typography component="h2" variant="h5" sx={{ color: `${blue[700]}` }}>
          GitHub Integration
        </Typography>
        <List>
          <ProfileField title="Username" value={userStore.username} />
          <ListItem>
            <Button variant="contained" onClick={() => setShowEditToken(true)}>
              Set GitHub Token
            </Button>
          </ListItem>
        </List>
      </>
    </>
  );
});

export default GitHubSettings;
