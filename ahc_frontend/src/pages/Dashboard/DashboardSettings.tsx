import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, TextField, Typography,
} from '@mui/material';
import { observer } from 'mobx-react';
import { useState } from 'react';
import GithubStore from '../../stores/GithubStore';
import { useStores } from '../../stores/MainStore';

const DashboardSettings = observer(() => {
  const { userStore, notificationStore } = useStores();
  const [showEditToken, setShowEditToken] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);

  if (!userStore.username) {
    userStore.getProfile();
  }

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
                notificationStore.set('error', '', result.message);
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
      <div>
        <Typography component="h4" variant="h5">
          Github Account:
          {' '}
          <a href={`https://github.com/${userStore.username}`}>{userStore.username}</a>
        </Typography>
        <Button variant="contained" onClick={() => setShowEditToken(true)}>Replace</Button>
      </div>
    </>
  );
});

export default DashboardSettings;
