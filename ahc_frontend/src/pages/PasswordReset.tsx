import {
  Container,
  Stack,
  Typography,
  Button,
  DialogActions,
  FormGroup,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStores } from '../stores/MainStore';
import UserStore from '../stores/UserStore';

const PasswordReset = () => {
  const { code } = useParams();
  const { notificationStore } = useStores();
  const [newPass, setNewPass] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);

  return (
    <Container sx={{ mt: 5 }}>
      <Stack direction="column" spacing={4} sx={{ mt: 5 }}>
        <Typography component="h1" variant="h2">Password Reset</Typography>
        <Typography component="h2" variant="h6">
          Enter the new password below.
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(newPass);
            setWaitingResponse(true);
            UserStore.resetPassword({ code: code as string, password: newPass }).then(() => {
              notificationStore.set('success', 'Password reset successfully.');
            }).catch((result) => {
              notificationStore.set('error', result.message);
            }).finally(() => {
              setWaitingResponse(false);
            });
          }}
        >
          <FormGroup sx={{ mb: 2, pt: 1 }}>
            <TextField
              label="New Password"
              type="password"
              placeholder="Enter new password"
              onChange={(e) => setNewPass(e.target.value)}
            />
          </FormGroup>

          <DialogActions>
            <Button variant="contained" type="submit" disabled={waitingResponse}>
              Reset Password
            </Button>
          </DialogActions>
        </form>
      </Stack>
    </Container>
  );
};

export default PasswordReset;
