import { observer } from 'mobx-react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useStores } from '../stores/MainStore';
import { NotificationInterface } from '../stores/NotificationStore';

const Notification = observer(() => {
  const { notificationStore } = useStores();

  const { notifications } = notificationStore;

  return (
    <div style={{
      position: 'fixed',
      zIndex: 2000,
      right: '0',
      transform: 'translate(-50%, 0px)',
      marginTop: '60px',
    }}
    >
      <ToastContainer className="p-3">
        {(Object.values(notifications)).map((notification: NotificationInterface) => {
          const {
            variant, title, text, footNote,
          } = notification;
          return (
            <Toast bg={variant.toLowerCase()}>
              {title && <Toast.Header>{title}</Toast.Header>}
              <Toast.Body>
                {text && <span>{text}</span>}
                {footNote && (
                <>
                  <hr />
                  <p className="mb-0">{footNote}</p>
                </>
                )}
              </Toast.Body>
            </Toast>
          );
        })}
      </ToastContainer>
    </div>
  );
});

export default Notification;
