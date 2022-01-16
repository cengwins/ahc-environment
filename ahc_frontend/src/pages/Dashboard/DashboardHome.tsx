import { observer } from 'mobx-react';
import { useState } from 'react';
import {
  Button, Form, ListGroup, Modal,
} from 'react-bootstrap';
import Loading from '../../components/Loading';
import { useStores } from '../../stores/MainStore';
import './DashboardHome.css';
import RepositoriesList from './RepositoriesList';

const DashboardHome = observer(() => {
  const { githubStore, repositoriesStore } = useStores();
  const [searchString, setSearchString] = useState('');
  const [show, setShow] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);

  const handleStringSearch = (e: any) => {
    const currentSearchString = e.target.value;
    setSearchString(currentSearchString);
    if (currentSearchString.length >= 3
      && githubStore.currentSearchString !== currentSearchString) {
      setSearching(true);
      setSearchFailed(false);
      githubStore.getGithubRepos(currentSearchString)
        .catch(() => {
          if (currentSearchString === e.target.value) {
            setSearchFailed(true);
          }
        }).finally(() => {
          if (currentSearchString === e.target.value) {
            setSearching(false);
          }
        });
    }
    repositoriesStore.getRepositories();
  };

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Repository</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form>
            <Form.Group className="mb-3" controlId="repository">
              <Form.Label>Search for repositories:</Form.Label>
              <Form.Control type="text" placeholder="Repository Name" onChange={handleStringSearch} />
            </Form.Group>
          </Form>

          {searchString && searchString.length < 3 && (
          <span className="small">
            Please enter at least 3 characters to start searching.
          </span>
          )}
          <div className="w-100">
            <Loading loading={searching} failed={searchFailed} />
          </div>
          {!searching
          && (
          <div>
            {searchString && searchString.length >= 3 && githubStore.userRepos.length === 0 && (
              <span>
                There are no repositories with the given name.
              </span>
            )}
            <ListGroup as="ol" variant="flush" className="text-start mt-3">
              {githubStore.userRepos.map((repository) => (
                <ListGroup.Item
                  as="li"
                  key={repository.full_name}
                  className="repository-item text-start"
                >
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <h2>{repository.name}</h2>
                    <a href={repository.html_url} target="_blank" rel="noreferrer">
                      Go
                    </a>
                  </div>
                  <Button onClick={() => {
                    repositoriesStore.createRepository(
                      { name: repository.name, upstream: repository.html_url },
                    );
                  }}
                  >
                    Add
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
          )}
        </Modal.Body>
      </Modal>

      <div className="d-flex flex-column min-vh-100">
        <div className="d-flex flex-row">
          <Button variant="danger" className="ms-auto" onClick={() => setShow(true)}>
            Delete
          </Button>
          <Button className="ms-2" onClick={() => setShow(true)}>
            Add Repository
          </Button>
        </div>

        <RepositoriesList />
      </div>
    </>
  );
});

export default DashboardHome;
