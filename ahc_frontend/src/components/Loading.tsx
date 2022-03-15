import { CircularProgress } from '@mui/material';

const Loading = (props : {loading: boolean, failed: boolean}) => {
  const { loading, failed } = props;
  if (loading || failed) {
    return (
      <>
        {loading && (
        <div className="d-flex flex-column">
          <p className="mx-auto">Loading..</p>
          <CircularProgress className="mx-auto mb-4" />
        </div>
        )}
        {failed && (
          <div>
            Failed to load. Please try again.
          </div>
        )}
      </>
    );
  }
  return (<div />);
};

export default Loading;
