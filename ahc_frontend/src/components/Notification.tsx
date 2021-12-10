import { observer, useObserver } from 'mobx-react';
import { Alert } from 'react-bootstrap';
import { useStores } from '../stores/MainStore';
import { NotificationInterface } from '../stores/NotificationStore';

const Notification = observer(() => {
  const { notificationStore } = useStores();

  const { notifications } = notificationStore;

  return useObserver(() => (
    <div style={{
      position: 'fixed',
      zIndex: 2000,
      right: '0',
      transform: 'translate(-50%, 0px)',
      marginTop: '60px',
    }}
    >
      {(Object.values(notifications)).map((notification: NotificationInterface) => {
        const {
          variant, title, text, footNote,
        } = notification;
        return (
          <Alert variant={variant}>
            {title && <Alert.Heading>{title}</Alert.Heading>}
            {text && <span>{text}</span>}
            {footNote && (
            <>
              <hr />
              <p className="mb-0">{footNote}</p>
            </>
            )}
          </Alert>
        );
      })}
    </div>
  ));
});

export default Notification;
