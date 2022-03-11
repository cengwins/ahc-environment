import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import { useStores } from '../../stores/MainStore';
import './DashboardHome.css';

const RepositoriesList = observer(() => {
  const { repositoriesStore } = useStores();
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    repositoriesStore.getRepositories()
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Loading loading={loading} failed={failedToLoad} />
      <ListGroup as="ol" variant="flush" className="text-start mt-3">
        {repositoriesStore.repositories && repositoriesStore.repositories.map((repo) => (
          <ListGroup.Item
            as="li"
            key={repo.id}
            className="repository-item text-start"
          >
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <input
                style={{ width: '16px', height: '16px' }}
                className="align-self-center me-2"
                type="checkbox"
                id="vehicle1"
                name="vehicle1"
                value="Bike"
              />
              <Container
                className="clickable"
                onClick={() => { navigate(`/dashboard/${repo.id}`); }}
              >
                <h2>{repo.name}</h2>
                <a href={`https://github.com/${repo.slug}`} className="ms-auto">{`${repo.slug}`}</a>
              </Container>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
});

export default RepositoriesList;
