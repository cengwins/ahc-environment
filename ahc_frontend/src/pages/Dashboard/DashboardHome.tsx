import { useState } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './DashboardHome.css';

const objectives = [
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

const DashboardHome = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Repository</Modal.Title>
        </Modal.Header>
        <Modal.Body>Lorem impsum</Modal.Body>
      </Modal>

      <div className="d-flex flex-column min-vh-100">
        <Button className="align-self-end" onClick={handleShow}>
          Add Repository
        </Button>

        <ListGroup as="ol" variant="flush" className="text-start mt-3">
          {objectives.map((objective) => (
            <ListGroup.Item
              as="li"
              key={objective.slug}
              onClick={() => { navigate(`/dashboard/${objective.id}`); }}
              className="repository-item text-start"
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
};

export default DashboardHome;
