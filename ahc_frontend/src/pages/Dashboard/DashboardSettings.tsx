import { observer } from 'mobx-react';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import GithubStore from '../../stores/GithubStore';
import { useStores } from '../../stores/MainStore';

const DashboardSettings = observer(() => {
  const { notificationStore } = useStores();
  const [showEditToken, setShowEditToken] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);

  return (
    <>
      <Modal show={showEditToken} onHide={() => setShowEditToken(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Github Token</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              setWaitingResponse(true);
              GithubStore.setGithubToken({ access_token: githubToken }).then(() => {
                notificationStore.set('success', '', 'Saved token.');
              }).catch((result) => {
                notificationStore.set('danger', '', result.message);
              }).finally(() => {
                setWaitingResponse(false);
              });
            }}
          >
            <Form.Group className="mb-3" controlId="github_token">
              <Form.Label>Github Token:</Form.Label>
              <Form.Control type="text" placeholder="Github Token" onChange={(e) => setGithubToken(e.target.value)} />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={waitingResponse}>
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <div className="d-flex flex-column min-vh-100">
        <div>
          <h4>
            Github Account:
            {' '}
            <a href="https://github.com/ucanyiit">ucanyiit</a>
          </h4>
          <Button onClick={() => setShowEditToken(true)}>Replace</Button>
        </div>
      </div>
    </>
  );
});

export default DashboardSettings;
