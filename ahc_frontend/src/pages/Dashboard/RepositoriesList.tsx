import { observer } from 'mobx-react';
import { useState } from 'react';
import { ListGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../../stores/MainStore';
import './DashboardHome.css';

const RepositoriesList = observer(() => {
  const { repositoriesStore } = useStores();
  const [loading, setLoading] = useState(false);
  const [failedToLoad, setFailed] = useState(false);
  const navigate = useNavigate();

  if (!repositoriesStore.repositories
    && !loading
    && !failedToLoad) {
    setLoading(true);
    repositoriesStore.getRepositories()
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }

  return (
    <div>
      {loading && (
      <div className="d-flex">
        <Spinner className="mx-auto my-4" animation="border" />
      </div>
      )}
      {failedToLoad && (
        <div>
          Failed to load repositories. Please try again.
        </div>
      )}
      <ListGroup as="ol" variant="flush" className="text-start mt-3">
        {repositoriesStore.repositories && repositoriesStore.repositories.map((repo) => (
          <ListGroup.Item
            as="li"
            key={repo.id}
            onClick={() => { navigate(`/dashboard/${repo.id}`); }}
            className="repository-item clickable text-start"
          >
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <h2>{repo.name}</h2>
              <a href={`https://github.com/${repo.slug}`} className="ms-auto">{`${repo.slug}`}</a>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
});

export default RepositoriesList;
