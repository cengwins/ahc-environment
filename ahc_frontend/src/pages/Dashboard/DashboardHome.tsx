import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useStores } from '../../stores/MainStore';
import mapAxiosError from '../../utils/mapAxiosError';
import './DashboardHome.css';
import RepositoriesList from './RepositoriesList';
import AddRepositoryManually from './Repository/AddRepositoryManually';
import AddRepositoryWithSearchDialog from './Repository/AddRepositoryWithSearch';

const DashboardHome = observer(() => {
  const { repositoriesStore, notificationStore, userStore } = useStores();
  const [searchShow, setSearchShow] = useState(false);
  const [manualShow, setManualShow] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [chosens, setChosens] = useState<string[]>([]);

  return (
    <>
      <AddRepositoryWithSearchDialog
        show={searchShow}
        setShow={setSearchShow}
        setManual={() => {
          setSearchShow(false);
          setManualShow(true);
        }}
      />
      <AddRepositoryManually
        show={manualShow}
        setShow={setManualShow}
        setSearch={() => {
          setManualShow(false);
          setSearchShow(true);
        }}
      />
      <div>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography component="h1" variant="h3" sx={{ color: `${blue[600]}` }}>
            Your Repositories
          </Typography>
          <Button
            color="error"
            variant="contained"
            sx={{ ml: 'auto' }}
            disabled={
              (repositoriesStore.repositories && repositoriesStore.repositories?.length === 0)
              || isDeleting
            }
            onClick={() => {
              if (chosens.length === 0) {
                notificationStore.set('info', 'Please choose repositories to delete.');
                return;
              }
              setIsDeleting(true);
              repositoriesStore.deleteRepositories(chosens)
                .then((removedIds) => {
                  if (chosens.length === removedIds.length) {
                    notificationStore.set('success', `${chosens.length === 1 ? 'A repository is' : `${chosens.length} repositories are`} deleted.`);
                  } else {
                    notificationStore.set('info', `Only ${removedIds.length} out of ${chosens.length} repositories are deleted.`);
                  }
                  setChosens(chosens.filter((chosenId) => !removedIds.includes(chosenId)));
                }).catch((result) => {
                  notificationStore.set('error', mapAxiosError(result));
                }).finally(() => {
                  setIsDeleting(false);
                });
            }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={() => {
              if (userStore.githubUsername) {
                setSearchShow(true);
              } else {
                notificationStore.set('error', 'Please first set GitHub token from profile menu.');
              }
            }}
          >
            Add Repository
          </Button>
        </Box>

        <RepositoriesList chosens={chosens} setChosens={setChosens} />
      </div>
    </>
  );
});

export default DashboardHome;
