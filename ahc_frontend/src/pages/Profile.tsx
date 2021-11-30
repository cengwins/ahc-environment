import {
  Container,
} from 'react-bootstrap';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useStores } from '../stores/MainStore';

const Profile = () => {
  const { userStore } = useStores();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container className="my-5">
        {userStore.username}
      </Container>
      <Footer />
    </div>
  );
};
export default Profile;
