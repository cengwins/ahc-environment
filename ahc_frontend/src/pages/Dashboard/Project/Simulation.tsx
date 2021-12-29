import { useParams } from 'react-router-dom';
import { useStores } from '../../../stores/MainStore';
import '../DashboardHome.css';

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

const simulation = {
  lastSimulationCommit: 'Fixed bug on connecting nodes',
  lastSimulationDate: new Date(),
  simulationProgress: 'In Progress',
  details: {
    timeTook: 42,
  },
};

const Simulation = () => {
  const { projectId, simulationId } = useParams();
  const { dashboardNavigationStore } = useStores();

  if (projectId) dashboardNavigationStore.setProjectId(projectId);
  if (simulationId) dashboardNavigationStore.setSimulationId(simulationId);

  return (
    <div className="d-flex flex-column min-vh-100">
      <h4>
        Simulation
        {' '}
        <span className="small" style={{ fontFamily: 'monospace', backgroundColor: '#ddd' }}>{project.lastSimulationCommit.hash}</span>
      </h4>
      <div>
        <span>Date: </span>
        <span>{`${project.lastSimulationDate.toLocaleDateString('tr-TR')}`}</span>
      </div>
      <div>
        <span>{simulation.lastSimulationCommit}</span>
      </div>
      <div>
        <span>{simulation.simulationProgress}</span>
        {(simulation.simulationProgress === 'Success' || simulation.simulationProgress === 'Fail') && <span>{`, took ${simulation.details?.timeTook} seconds`}</span>}
        {simulation.simulationProgress === 'In Progress' && <span>{`, took ${simulation.details?.timeTook} seconds to date`}</span>}
      </div>
    </div>
  );
};

export default Simulation;
