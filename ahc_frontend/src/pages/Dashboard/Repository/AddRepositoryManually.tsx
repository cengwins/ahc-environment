import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  TextField,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useStores } from '../../../stores/MainStore';

const AddRepositoryManually = observer((
  { show, setShow, setSearch }: {show: boolean, setShow: any, setSearch: any},
) => {
  const { repositoriesStore, notificationStore } = useStores();
  const [url, setUrl] = useState('');
  const [waitingResponse, setLoading] = useState(false);

  return (
    <Dialog fullWidth open={show} onClose={() => setShow(false)}>
      <DialogTitle>
        <Typography variant="h5">
          Copy your GitHub repository URL below
        </Typography>
        <Button fullWidth={false} size="small" onClick={() => setSearch()}>
          Search Repositories
        </Button>
      </DialogTitle>

      <DialogContent>
        <form>
          <FormGroup sx={{ mb: 2, pt: 1 }}>
            <TextField type="text" label="Repository URL" placeholder="Repository URL" onChange={(e) => setUrl(e.target.value)} />
          </FormGroup>
        </form>

        <DialogActions>
          <LoadingButton
            variant="contained"
            loading={waitingResponse}
            onClick={
              () => {
                setLoading(true);
                repositoriesStore.createRepository({ upstream: url, name: url.split('/').pop() as string })
                  .then(() => {
                    notificationStore.set('success', 'Repository added successfully');
                    setShow(false);
                  })
                  .catch(() => notificationStore.set('error', 'Failed to add repository'))
                  .finally(() => setLoading(false));
              }
}
          >
            Add
          </LoadingButton>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
});

export default AddRepositoryManually;
