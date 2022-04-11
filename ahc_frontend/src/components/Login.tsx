import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, TextField,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../stores/MainStore';

const LogInDialog = ({
  open, onClose, forgotPassword, dontHaveAccount,
}:
  {open:boolean, onClose: any, forgotPassword: any, dontHaveAccount: any}) => {
  const { userStore, notificationStore } = useStores();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);
  const navigate = useNavigate();

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
    >
      <DialogTitle sx={{ alignSelf: 'center' }}>
        Log In
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setWaitingResponse(true);
            userStore.login({ username, password })
              .then(() => {
                notificationStore.set('success', 'Logged in!');
                onClose();
              })
              .then(() => userStore.getProfile())
              .then(() => navigate('/dashboard'))
              .catch((result) => {
                notificationStore.set('error', result.message);
              })
              .finally(() => {
                setWaitingResponse(false);
              });
          }}
        >
          <FormGroup sx={{ mb: 2, pt: 1 }}>
            <TextField label="User Name" type="text" placeholder="Enter user name" onChange={(e) => setUsername(e.target.value)} />
          </FormGroup>

          <FormGroup sx={{ mb: 2 }}>
            <TextField label="Password" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </FormGroup>
          <DialogActions>
            <Button size="small" color="error" onClick={forgotPassword}>
              Forgot Password?
            </Button>
            <Button size="small" onClick={dontHaveAccount}>
              Create Account
            </Button>
            <Button variant="contained" type="submit" disabled={waitingResponse}>
              Log In
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default LogInDialog;
