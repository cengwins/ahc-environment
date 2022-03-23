import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, TextField,
} from '@mui/material';
import { useState } from 'react';

const ResetPasswordDialog = ({ open, onClose }: {open:boolean, onClose: any}) => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
    >
      <DialogTitle sx={{ alignSelf: 'center' }}>
        Reset Password
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(oldPass, newPass);
            onClose();
            setWaitingResponse(true);
          }}
        >
          <FormGroup sx={{ mb: 2, pt: 1 }}>
            <TextField label="Old Password" type="text" placeholder="Old Password" onChange={(e) => setOldPass(e.target.value)} />
          </FormGroup>

          <FormGroup sx={{ mb: 2 }}>
            <TextField label="New Password" type="password" placeholder="New Password" onChange={(e) => setNewPass(e.target.value)} />
          </FormGroup>
          <DialogActions>
            <Button variant="contained" type="submit" disabled={waitingResponse}>
              Reset
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default ResetPasswordDialog;
