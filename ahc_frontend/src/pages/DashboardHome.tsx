import { ListGroup } from 'react-bootstrap';

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
    githubPath: 'oznakn/project-connect',
    branch: 'dev',
    lastSimulationCommit: 'Fixed bug on connecting nodes',
    lastSimulationDate: new Date(),
  },
];

const DashboardHome = () => (
  <div className="d-flex flex-column min-vh-100">
    {/* <div>
      Choose github repo
    </div> */}
    <ListGroup as="ol" variant="flush" className="text-start mt-4">
      {objectives.map((objective) => (
        <ListGroup.Item as="li" key={objective.githubPath}>
          <div className="flex">
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <h2>{objective.projectName}</h2>
              <span className="small">{`(${objective.lastSimulationDate.toLocaleDateString('tr-TR')})`}</span>
              <a href={`https://github.com/${objective.githubPath}/${objective.branch}`} className="ms-auto">{`${objective.githubPath} | ${objective.branch}`}</a>
            </div>
          </div>
          <span>{objective.lastSimulationCommit}</span>
        </ListGroup.Item>
      ))}
    </ListGroup>
  </div>
);

export default DashboardHome;
