import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';

const AlertDialog = ({
  open, onYes, onNo, text, title,
}:
  {open:boolean, onYes: any, onNo: any, text: String, title: String}) => (
    <Dialog
      fullWidth
      open={open}
      onClose={onNo}
    >
      <DialogTitle sx={{ alignSelf: 'center' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        {text}
      </DialogContent>
      <DialogActions>
        <Button size="small" color="success" onClick={onYes}>
          Yes
        </Button>
        <Button size="small" color="error" onClick={onNo}>
          No
        </Button>
      </DialogActions>
    </Dialog>
);
export default AlertDialog;
