import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../stores/MainStore';
import mapAxiosError from '../utils/mapAxiosError';
import ExtendedTextField from './ExtendedTextField';

const LogInDialog = ({
  open, onClose, forgotPassword, dontHaveAccount,
}:
  {open:boolean, onClose: any, forgotPassword: any, dontHaveAccount: any}) => {
  const { userStore, notificationStore } = useStores();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    username: [],
    password: [],
    detail: '',
  });

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
                notificationStore.set('error', mapAxiosError(result));
                setErrors(result.response.data.errors);
              })
              .finally(() => {
                setWaitingResponse(false);
              });
          }}
        >
          <FormGroup sx={{ mb: 2, pt: 1 }}>
            <ExtendedTextField
              label="User Name"
              type="text"
              placeholder="Enter user name"
              onChange={setUsername}
              errors={errors.username}
              required
            />
          </FormGroup>

          <FormGroup sx={{ mb: 2 }}>
            <ExtendedTextField
              label="Password"
              type="password"
              placeholder="Password"
              onChange={setPassword}
              errors={errors.password}
              required
            />
          </FormGroup>

          {(!waitingResponse && errors.detail) && (
            <Alert sx={{ mb: 2 }} severity="error">
              {errors.detail}
            </Alert>
          )}

          <DialogActions>
            <Button size="small" color="error" onClick={forgotPassword}>
              Forgot Password?
            </Button>
            <Button size="small" onClick={dontHaveAccount}>
              Create Account
            </Button>
            <LoadingButton variant="contained" type="submit" loading={waitingResponse}>
              Log In
            </LoadingButton>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default LogInDialog;
