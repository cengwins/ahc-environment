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

const RepositoryRow = ({
  repository, navigate, chosen, onValueChange,
}:
  {repository: RepositoryInfo, navigate: any, chosen: boolean, onValueChange: any}) => (
    <TableRow
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell variant="body">
        <Checkbox value={chosen} onChange={() => onValueChange(repository.id, !chosen)} />
      </TableCell>
      <Tooltip title={`/dashboard/${repository.id}`}>
        <TableCell variant="body" className="repository-name text-start clickable" onClick={() => { navigate(`/dashboard/${repository.id}`); }}>
          {repository.name}
        </TableCell>
      </Tooltip>
      <TableCell variant="body" align="right">
        <Tooltip title={repository.upstream}>
          <Button href={repository.upstream} className="ms-auto">{repository.upstream_type}</Button>
        </Tooltip>
      </TableCell>
    </TableRow>
);

const RepositoriesList = observer(({ chosens, setChosens }
  : {chosens: string[], setChosens: any}) => {
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
              <TableCell variant="head" />
              <TableCell variant="head">Repository</TableCell>
              <TableCell variant="head" align="right">Upstream</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {repositoriesStore.repositories && repositoriesStore.repositories.map((repository) => (
              <RepositoryRow
                key={repository.id}
                repository={repository}
                navigate={navigate}
                chosen={chosens.includes(repository.id)}
                onValueChange={(id: string, value: boolean) => {
                  if (value) {
                    setChosens([...chosens, repository.id]);
                  } else {
                    setChosens(chosens.filter((curId) => curId !== repository.id));
                  }
                }}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
});

export default RepositoriesList;
