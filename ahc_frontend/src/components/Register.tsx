import {
  Button, Dialog, DialogContent, DialogTitle, FormGroup, TextField,
} from '@mui/material';
import { useState } from 'react';
import { useStores } from '../stores/MainStore';

const Register = ({ open, onClose }: {open:boolean, onClose: any}) => {
  const { userStore, notificationStore } = useStores();
  const [username, setUsername] = useState('');
  const [email, setMail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        Register
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setWaitingResponse(true);
            userStore.register({
              username, email, first_name: name, last_name: surname, password,
            }).then(() => {
              notificationStore.set('success', 'Registered!');
              onClose();
            }).catch((result) => {
              notificationStore.set('error', result.message);
            }).finally(() => {
              setWaitingResponse(false);
            });
          }}
        >
          <FormGroup sx={{ mb: 2, pt: 1 }}>
            <TextField label="User Name" type="username" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} />
          </FormGroup>
          <FormGroup sx={{ mb: 2 }}>
            <TextField label="Email" type="email" placeholder="Enter email" onChange={(e) => setMail(e.target.value)} />
          </FormGroup>

          <FormGroup sx={{ mb: 2 }}>
            <TextField label="Name" type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
          </FormGroup>

          <FormGroup sx={{ mb: 2 }}>
            <TextField label="Surname" type="text" placeholder="Surname" onChange={(e) => setSurname(e.target.value)} />
          </FormGroup>

          <FormGroup sx={{ mb: 2 }}>
            <TextField label="Password" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </FormGroup>
          <Button variant="contained" type="submit" disabled={waitingResponse}>
            Register
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default Register;
