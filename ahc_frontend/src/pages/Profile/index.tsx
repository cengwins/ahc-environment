import {
  Button, Container, List, ListItem, Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import ResetPasswordDialog from '../../components/ResetPassword';
import { useStores } from '../../stores/MainStore';
import GitHubSettings from './GitHubSettings';
import ProfileField from './ProfileField';

const Profile = observer(() => {
  const { userStore } = useStores();
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailed] = useState(false);
  const [resetPassOpen, setResetPassOpen] = useState(false);

  const {
    username, email, name, surname,
  } = userStore;

  useEffect(() => {
    userStore.getProfile()
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container sx={{ py: 5 }}>
      <Typography component="h1" variant="h2" sx={{ my: 5, color: `${blue[600]}` }}>
        Profile
      </Typography>
      <div>
        <Loading loading={loading} failed={failedToLoad} />
        {!loading && !failedToLoad && (
          <div>
            <Typography component="h2" variant="h5" sx={{ color: `${blue[700]}` }}>
              General Information
            </Typography>
            <List>
              <ProfileField title="Username" value={username} />
              <ProfileField title="Email" value={email} />
              <ProfileField title="Name" value={`${name} ${surname}`} />
            </List>
            <Typography component="h2" variant="h5" sx={{ color: `${blue[700]}` }}>
              Password & Security
            </Typography>
            <List>
              <ListItem>
                <Button variant="contained" onClick={() => setResetPassOpen(true)}>
                  Reset Password
                </Button>
              </ListItem>
            </List>
            <GitHubSettings />
          </div>
        )}
      </div>

      <ResetPasswordDialog
        open={resetPassOpen}
        onClose={() => setResetPassOpen(false)}
      />

    </Container>
  );
});

export default Profile;
