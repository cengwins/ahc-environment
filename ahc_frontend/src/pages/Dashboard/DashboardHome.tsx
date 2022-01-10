import { observer } from 'mobx-react';
import { useState } from 'react';
import {
  Button, Form, ListGroup, Modal, Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../../stores/MainStore';
import './DashboardHome.css';

const repositories = [
  {
    id: 'id1',
    name: 'Project 1',
    slug: 'ucanyiit/532',
    branch: 'main',
    lastSimulationCommit: 'Implemented error detection and correction mechanism',
    lastSimulationDate: new Date(),
  },
  {
    id: 'id2',
    name: 'Project 2',
    slug: 'ucanyiit/project-connect',
    branch: 'dev',
    lastSimulationCommit: 'Fixed bug on connecting nodes',
    lastSimulationDate: new Date(),
  },
];

const DashboardHome = observer(() => {
  const { githubStore, repositoriesStore } = useStores();
  const [searchString, setSearchString] = useState('');
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleStringSearch = (e: any) => {
    setSearchString(e.target.value);
    if (searchString.length >= 3 && githubStore.currentSearchString !== searchString) {
      githubStore.getGithubRepos(searchString);
    }
    repositoriesStore.getRepositories();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
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
          {githubStore.searching && (
          <div className="d-flex">
            <Spinner className="mx-auto my-4" animation="border" />
          </div>
          )}

          {!githubStore.searching
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
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
        </Modal.Body>
      </Modal>

      <div className="d-flex flex-column min-vh-100">
        <Button className="align-self-end" onClick={handleShow}>
          Add Repository
        </Button>

        <ListGroup as="ol" variant="flush" className="text-start mt-3">
          {repositories.map((objective) => (
            <ListGroup.Item
              as="li"
              key={objective.slug}
              onClick={() => { navigate(`/dashboard/${objective.id}`); }}
              className="repository-item clickable text-start"
            >
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <h2>{objective.name}</h2>
                <span className="small">{`(${objective.lastSimulationDate.toLocaleDateString('tr-TR')})`}</span>
                <a href={`https://github.com/${objective.slug}/${objective.branch}`} className="ms-auto">{`${objective.slug} | ${objective.branch}`}</a>
              </div>
              <span>{objective.lastSimulationCommit}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </>
  );
});

export default DashboardHome;
