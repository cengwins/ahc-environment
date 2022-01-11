import { observer } from 'mobx-react';
import { useState } from 'react';
import {
  Button, Form, ListGroup, Modal, Spinner,
} from 'react-bootstrap';
import { useStores } from '../../stores/MainStore';
import './DashboardHome.css';
import RepositoriesList from './RepositoriesList';

const DashboardHome = observer(() => {
  const { githubStore, repositoriesStore } = useStores();
  const [searchString, setSearchString] = useState('');
  const [show, setShow] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleStringSearch = (e: any) => {
    const currentSearchString = e.target.value;
    setSearchString(currentSearchString);
    if (currentSearchString.length >= 3
      && githubStore.currentSearchString !== currentSearchString) {
      setSearching(true);
      githubStore.getGithubRepos(currentSearchString).finally(() => {
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
          {searching && (
          <div className="d-flex">
            <Spinner className="mx-auto my-4" animation="border" />
          </div>
          )}

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
                  </div>
                  <a href={repository.html_url} target="_blank" rel="noreferrer">
                    Go
                  </a>
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
        <Button className="align-self-end" onClick={() => setShow(true)}>
          Add Repository
        </Button>

        <RepositoriesList />
      </div>
    </>
  );
});

export default DashboardHome;
