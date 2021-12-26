import { Button } from 'react-bootstrap';
import {
  useLocation, useNavigate,
} from 'react-router-dom';
import ProjectHistory from './ProjectHistory';
import ProjectHome from './ProjectHome';
import Simulation from './Simulation';

const project = {
  projectName: 'Project 1',
  githubPath: 'ucanyiit/532',
  branch: 'main',
  lastSimulationCommit: {
    message: 'Implemented error detection and correction mechanism',
    hash: 'ef9febd0',
  },
  lastSimulationDate: new Date(),
};

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Button onClick={() => { navigate('/dashboard'); }} className="align-self-start mb-3">
        All Projects
      </Button>
      <div className="mb-2 d-flex flex-row">
        <span className="h2">{project.projectName}</span>
        <a className="ms-auto" href={`https://github.com/${project.githubPath}/${project.branch}`}>
          {`${project.githubPath} | ${project.branch}`}
        </a>
      </div>

      <div>

        {location.pathname === '/dashboard/project/history' && <ProjectHistory />}
        {location.pathname === '/dashboard/project' && <ProjectHome />}
        {location.pathname === '/dashboard/simulation' && <Simulation />}
      </div>
    </div>
  );
};

export default Project;
