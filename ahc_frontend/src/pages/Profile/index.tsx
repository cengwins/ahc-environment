import {
  Button, Container, Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { CheckCircle, Cancel } from '@mui/icons-material';
import Loading from '../../components/Loading';
import PropertyList from '../../components/PropertyList';
import { useStores } from '../../stores/MainStore';
import UserStore from '../../stores/UserStore';
import GitHubSettings from './GitHubSettings';
import mapAxiosError from '../../utils/mapAxiosError';

const Profile = observer(() => {
  const { userStore, notificationStore } = useStores();
  const [loading, setLoading] = useState(true);
  const [resetButtonLoading, setResetButtonLoading] = useState(false);
  const [failedToLoad, setFailed] = useState(false);

  const {
    username, email, firstName, lastName, activated,
  } = userStore;

  useEffect(() => {
    userStore.getProfile()
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  const generalProperties = [
    { title: 'Username', value: username },
    { title: 'Email', value: email },
    { title: 'Name', value: firstName },
    { title: 'Surname', value: lastName },
    { title: 'Activated', value: activated ? <CheckCircle color="success" /> : <Cancel color="error" /> },
  ];

  const securityProperties = [
    {
      title: 'Reset Password',
      value: (
        <Button
          variant="contained"
          disabled={resetButtonLoading}
          onClick={() => {
            setResetButtonLoading(true);
            UserStore.resetPasswordRequest({ email }).then(() => {
              notificationStore.set('success', 'Password reset request is received. Check your email.');
            }).catch((result) => {
              notificationStore.set('error', mapAxiosError(result));
            }).finally(() => {
              setResetButtonLoading(false);
            });
          }}
        >
          Reset Password
        </Button>
      ),
    },
  ];

  return (
    <Container sx={{ py: 5 }} maxWidth="md">
      <Typography component="h1" variant="h3" sx={{ my: 5, color: `${blue[600]}` }}>
        Profile
      </Typography>
      <div>
        <Loading loading={loading} failed={failedToLoad} />
        {!loading && !failedToLoad && (
          <div>
            <Typography component="h2" variant="h5" sx={{ color: `${blue[700]}`, my: 2 }}>
              General Information
            </Typography>
            <PropertyList properties={generalProperties} />
            <Typography component="h2" variant="h5" sx={{ color: `${blue[700]}`, my: 2 }}>
              Security
            </Typography>
            <PropertyList properties={securityProperties} />
            <GitHubSettings />
          </div>
        )}
      </div>

    </Container>
  );
});

export default Profile;
