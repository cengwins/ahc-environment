import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, TextField,
} from '@mui/material';
import { useState } from 'react';
import { useStores } from '../stores/MainStore';
import UserStore from '../stores/UserStore';
import mapAxiosError from '../utils/mapAxiosError';

const ForgotPasswordDialog = ({ open, onClose, loginInstead }:
  {open:boolean, onClose: any, loginInstead: any}) => {
  const { notificationStore } = useStores();
  const [email, setEmail] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
    >
      <DialogTitle sx={{ alignSelf: 'center' }}>
        Password Reset Request
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setWaitingResponse(true);
            UserStore.resetPasswordRequest({ email }).then(() => {
              notificationStore.set('success', 'Password reset request is received. Check your email.');
            }).catch((result) => {
              notificationStore.set('error', mapAxiosError(result));
            }).finally(() => {
              setWaitingResponse(false);
            });
          }}
        >
          <FormGroup sx={{ mb: 2, pt: 1 }}>
            <TextField label="Email" type="text" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
          </FormGroup>

          <DialogActions>
            <Button size="small" onClick={loginInstead}>
              Log In
            </Button>
            <Button variant="contained" type="submit" disabled={waitingResponse}>
              Send Request
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
