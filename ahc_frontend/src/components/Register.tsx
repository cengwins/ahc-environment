import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup,
} from '@mui/material';
import { useState } from 'react';
import { useStores } from '../stores/MainStore';
import ExtendedTextField from './ExtendedTextField';

const Register = ({ open, onClose, haveAccount }:
  {open:boolean, onClose: any, haveAccount: any}) => {
  const { userStore, notificationStore } = useStores();
  const [username, setUsername] = useState('');
  const [email, setMail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);

  const [errors, setErrors] = useState({
    username: [],
    email: [],
    first_name: [],
    last_name: [],
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
        Register
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setWaitingResponse(true);
            userStore.register({
              username, email, first_name: firstName, last_name: lastName, password,
            }).then(() => {
              notificationStore.set('success', 'Registered!');
              onClose();
            }).catch((result) => {
              notificationStore.set('error', result.response.data.errors.detail || result.message);
              setErrors(result.response.data.errors);
            }).finally(() => {
              setWaitingResponse(false);
            });
          }}
        >

          <FormGroup sx={{ mb: 2, pt: 1 }}>
            <ExtendedTextField
              label="User Name"
              type="username"
              placeholder="Enter username"
              onChange={setUsername}
              errors={errors.username}
              required
            />
          </FormGroup>

          <FormGroup sx={{ mb: 2 }}>
            <ExtendedTextField
              label="Email"
              type="email"
              placeholder="Enter email"
              onChange={setMail}
              errors={errors.email}
              required
            />
          </FormGroup>

          <FormGroup sx={{ mb: 2 }}>
            <ExtendedTextField
              label="Name"
              type="text"
              placeholder="Name"
              onChange={setFirstName}
              errors={errors.first_name}
              required
            />
          </FormGroup>

          <FormGroup sx={{ mb: 2 }}>
            <ExtendedTextField
              label="Last Name"
              type="text"
              placeholder="Last Name"
              onChange={setLastName}
              errors={errors.last_name}
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
            <Button size="small" onClick={haveAccount}>
              Already have an account?
            </Button>
            <LoadingButton variant="contained" type="submit" disabled={waitingResponse}>
              Register
            </LoadingButton>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default Register;
