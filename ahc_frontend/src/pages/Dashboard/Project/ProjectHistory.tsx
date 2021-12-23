import { ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const simulations = [
  {
    lastSimulationCommit: 'Implemented error detection and correction mechanism',
    lastSimulationDate: new Date(),
    simulationProgress: 'Success',
    details: {
      timeTook: 149,
    },
  },
  {
    lastSimulationCommit: 'Fixed bug on connecting nodes',
    lastSimulationDate: new Date(),
    simulationProgress: 'In Progress',
    details: {
      timeTook: 42,
    },
  },
  {
    lastSimulationCommit: 'Refactored connections on initial nodes',
    lastSimulationDate: new Date(),
    simulationProgress: 'Queueing',
  },
];

const ProjectHistory = () => {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column min-vh-100">
      <ListGroup as="ol" variant="flush" className="text-start">
        {simulations.map((simulation) => (
          <ListGroup.Item
            as="li"
            key={simulation.lastSimulationCommit}
            onClick={() => { navigate('/dashboard/project/simulation'); }}
            className="project-item text-start"
          >
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <span className="small">{`(${simulation.lastSimulationDate.toLocaleDateString('tr-TR')})`}</span>
            </div>
            <div>
              <span>{simulation.lastSimulationCommit}</span>
            </div>
            <div>
              <span>{simulation.simulationProgress}</span>
              {(simulation.simulationProgress === 'Success' || simulation.simulationProgress === 'Fail') && <span>{`, took ${simulation.details?.timeTook} seconds`}</span>}
              {simulation.simulationProgress === 'In Progress' && <span>{`, took ${simulation.details?.timeTook} seconds to date`}</span>}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default ProjectHistory;
