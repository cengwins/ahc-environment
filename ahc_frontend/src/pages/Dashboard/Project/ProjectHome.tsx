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

const ProjectHome = () => (
  <div className="d-flex flex-column min-vh-100">
    <div>
      <h4>
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

export default ProjectHome;
