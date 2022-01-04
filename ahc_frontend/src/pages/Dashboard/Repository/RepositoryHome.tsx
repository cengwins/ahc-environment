import { useParams } from 'react-router-dom';
import { useStores } from '../../../stores/MainStore';
import '../DashboardHome.css';

const repository = {
  id: 'id1',
  name: 'Repository 1',
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

const RepositoryField = (title: string, value: string) => (
  <div>
    <span>{`${title}: `}</span>
    <span>{value}</span>
  </div>
);

const RepositoryHome = () => {
  const { repositoryId } = useParams();
  const { dashboardNavigationStore } = useStores();

  if (repositoryId) dashboardNavigationStore.setRepositoryId(repositoryId);

  return (
    <div className="d-flex flex-column min-vh-100">
      <div>
        <h4>
          {repository.name}
          {' '}
          <span className="small" style={{ fontFamily: 'monospace', backgroundColor: '#ddd' }}>{repository.slug}</span>
        </h4>
        {RepositoryField('Created At', repository.created_at.toLocaleDateString('tr-TR'))}
        {RepositoryField('Updated At', repository.updated_at.toLocaleDateString('tr-TR'))}
        <h4 className="mt-3">
          Last Simulation
          {' '}
          <span className="small" style={{ fontFamily: 'monospace', backgroundColor: '#ddd' }}>{repository.lastSimulationCommit.hash}</span>
        </h4>
        <div>
          <span>Date: </span>
          <span>{`${repository.lastSimulationDate.toLocaleDateString('tr-TR')}`}</span>
        </div>
        <div>
          <span>Message: </span>
          <span>{repository.lastSimulationCommit.message}</span>
        </div>
      </div>
    </div>
  );
};

export default RepositoryHome;
