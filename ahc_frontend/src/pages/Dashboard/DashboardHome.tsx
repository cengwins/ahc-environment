import { useState } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './DashboardHome.css';

const objectives = [
  {
    projectName: 'Project 1',
    githubPath: 'ucanyiit/532',
    branch: 'main',
    lastSimulationCommit: 'Implemented error detection and correction mechanism',
    lastSimulationDate: new Date(),
  },
  {
    projectName: 'Project 2',
    githubPath: 'ucanyiit/project-connect',
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
          <Modal.Title>New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>Lorem impsum</Modal.Body>
      </Modal>

      <div className="d-flex flex-column min-vh-100">
        <Button className="align-self-end" onClick={handleShow}>
          New Project
        </Button>

        <ListGroup as="ol" variant="flush" className="text-start mt-3">
          {objectives.map((objective) => (
            <ListGroup.Item
              as="li"
              key={objective.githubPath}
              onClick={() => { navigate('/dashboard/project'); }}
              className="project-item text-start"
            >
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <h2>{objective.projectName}</h2>
                <span className="small">{`(${objective.lastSimulationDate.toLocaleDateString('tr-TR')})`}</span>
                <a href={`https://github.com/${objective.githubPath}/${objective.branch}`} className="ms-auto">{`${objective.githubPath} | ${objective.branch}`}</a>
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
