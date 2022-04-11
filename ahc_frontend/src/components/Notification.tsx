import { Alert, Snackbar } from '@mui/material';
import { observer } from 'mobx-react';
import { useStores } from '../stores/MainStore';
import { NotificationInterface } from '../stores/NotificationStore';

const Notification = observer(() => {
  const { notificationStore } = useStores();

  const { notifications } = notificationStore;

  return (
    <div>
      {(Object.values(notifications)).map(({ id, variant, text }: NotificationInterface) => (
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} key={id} open>
          <Alert severity={variant} sx={{ width: '100%' }}>
            {text}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );
});

export default Notification;
