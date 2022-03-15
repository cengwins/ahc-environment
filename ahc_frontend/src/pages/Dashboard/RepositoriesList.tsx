import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  Button,
  Tooltip,
  Checkbox,
} from '@mui/material';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RepositoryInfo } from '../../stores/RepositoriesStore';
import Loading from '../../components/Loading';
import { useStores } from '../../stores/MainStore';
import './DashboardHome.css';

const RepositoryRow = ({ repository, navigate }: {repository: RepositoryInfo, navigate: any}) => (
  <TableRow
    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
  >
    <TableCell>
      <Checkbox />
    </TableCell>
    <Tooltip title={`/dashboard/${repository.id}`}>
      <TableCell className="repository-name text-start clickable" onClick={() => { navigate(`/dashboard/${repository.id}`); }}>
        {repository.name}
      </TableCell>
    </Tooltip>
    <TableCell align="right">
      <Tooltip title={repository.upstream}>
        <Button href={repository.upstream} className="ms-auto">{repository.upstream_type}</Button>
      </Tooltip>
    </TableCell>
  </TableRow>
);

const RepositoriesList = observer(() => {
  const { repositoriesStore } = useStores();
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    repositoriesStore.getRepositories()
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Loading loading={loading} failed={failedToLoad} />

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Repository</TableCell>
              <TableCell align="right">Upstream</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {repositoriesStore.repositories && repositoriesStore.repositories.map((repository) => (
              <RepositoryRow key={repository.id} repository={repository} navigate={navigate} />))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
});

export default RepositoriesList;
