import {
  Button, Container, List, ListItem, Typography,
} from '@mui/material';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import ResetPasswordDialog from '../components/ResetPassword';
import { useStores } from '../stores/MainStore';

const ProfileField = (title: string, value: string) => (
  <ListItem>
    <Typography sx={{ mr: 1, fontWeight: 700 }}>{`${title}:`}</Typography>
    <Typography>{value}</Typography>
  </ListItem>
);

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
      <Typography component="h1" variant="h2" sx={{ my: 5 }}>
        Profile
      </Typography>
      <div>
        <Loading loading={loading} failed={failedToLoad} />
        {!loading && !failedToLoad && (
          <div>
            <Typography component="h2" variant="h5">General Information: </Typography>
            <List>
              {ProfileField('Username', username)}
              {ProfileField('Email', email)}
              {ProfileField('Name', `${name} ${surname}`)}
            </List>
            <Typography component="h2" variant="h5">Password & Security: </Typography>
            <List>
              <ListItem>
                <Button variant="contained" onClick={() => setResetPassOpen(true)}>
                  Reset Password
                </Button>
              </ListItem>
            </List>
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
