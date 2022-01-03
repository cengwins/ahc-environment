import { useParams } from 'react-router-dom';
import { useStores } from '../../../stores/MainStore';
import '../DashboardHome.css';

const project = {
  id: 'id1',
  name: 'Project 1',
  slug: 'ucanyiit/532',
  created_at: new Date(),
  updated_at: new Date(),
  branch: 'main',
  lastSimulationCommit: {
    message: 'Implemented error detection and correction mechanism',
    hash: 'ef9febd0',
  },
  lastSimulationDate: new Date(),
};

const ProjectField = (title: string, value: string) => (
  <div>
    <span>{`${title}: `}</span>
    <span>{value}</span>
  </div>
);

const ProjectHome = () => {
  const { projectId } = useParams();
  const { dashboardNavigationStore } = useStores();

  if (projectId) dashboardNavigationStore.setProjectId(projectId);

  return (
    <div className="d-flex flex-column min-vh-100">
      <div>
        <h4>
          {project.name}
          {' '}
          <span className="small" style={{ fontFamily: 'monospace', backgroundColor: '#ddd' }}>{project.slug}</span>
        </h4>
        {ProjectField('Created At', project.created_at.toLocaleDateString('tr-TR'))}
        {ProjectField('Updated At', project.updated_at.toLocaleDateString('tr-TR'))}
        <h4 className="mt-3">
          Last Simulation
          {' '}
          <span className="small" style={{ fontFamily: 'monospace', backgroundColor: '#ddd' }}>{project.lastSimulationCommit.hash}</span>
        </h4>
        <div>
          <span>Date: </span>
          <span>{`${project.lastSimulationDate.toLocaleDateString('tr-TR')}`}</span>
        </div>
        <div>
          <span>Message: </span>
          <span>{project.lastSimulationCommit.message}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectHome;
