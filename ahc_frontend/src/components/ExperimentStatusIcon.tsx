import {
  CheckCircle, Cancel, ChangeCircle, PauseCircle, FlagCircle,
} from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { ExperimentStatus } from '../stores/ExperimentStore';

const getExperimentStatusText = (status: ExperimentStatus) => {
  switch (status) {
    case 'completed':
      return 'Experiment is done';
    case 'failed':
      return 'Experiment is failed to complete';
    case 'running':
      return 'Experiment is currently running';
    case 'pending':
      return 'Experiment is in queue';
    case 'canceled':
      return 'Experiment canceled';
    default:
      return 'Errenous';
  }
};

const ExperimentStatusIcon = (({ status }: {status: ExperimentStatus}) => {
  switch (status) {
    case 'completed':
      return <CheckCircle color="success" />;
    case 'failed':
      return <FlagCircle color="error" />;
    case 'running':
      return <ChangeCircle color="secondary" />;
    case 'pending':
      return <PauseCircle color="info" />;
    case 'canceled':
      return <Cancel color="warning" />;
    default:
      return <Cancel color="error" />;
  }
});

const ExperimentStatusWithToolTip = (({ status }: {status: ExperimentStatus}) => (
  <Tooltip title={getExperimentStatusText(status)}>
    <IconButton sx={{ padding: 0 }}>
      <ExperimentStatusIcon status={status} />
    </IconButton>
  </Tooltip>
));

export default ExperimentStatusWithToolTip;
