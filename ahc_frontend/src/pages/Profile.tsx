import { Button, Container } from '@mui/material';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Loading from '../components/Loading';
import { useStores } from '../stores/MainStore';

const ProfileField = (title: string, value: string) => (
  <div>
    <span>{`${title}: `}</span>
    <span>{value}</span>
  </div>
);

const Profile = observer(() => {
  const { userStore } = useStores();
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailed] = useState(false);

  const {
    username, email, name, surname,
  } = userStore;

  useEffect(() => {
    userStore.getProfile()
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container className="my-5">
        <h1 className="mt-5">
          Profile
        </h1>
        <div className="mt-5">
          <Loading loading={loading} failed={failedToLoad} />
          {!loading && !failedToLoad && (
          <div>
            {ProfileField('Username', username)}
            {ProfileField('Email', email)}
            {ProfileField('Name', `${name} ${surname}`)}
            <Button variant="contained" className="mt-4">
              Reset Password
            </Button>
          </div>
          )}
        </div>
      </Container>
      <Footer />
    </div>
  );
});
export default Profile;
