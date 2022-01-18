import { Spinner } from 'react-bootstrap';

const Loading = (props : {loading: boolean, failed: boolean}) => {
  const { loading, failed } = props;
  if (loading || failed) {
    return (
      <>
        {loading && (
        <div className="d-flex flex-column">
          <p className="mx-auto">Loading..</p>
          <Spinner className="mx-auto mb-4" animation="border" />
        </div>
        )}
        {failed && (
          <div>
            Failed to load the repository. Please try again.
          </div>
        )}
      </>
    );
  }
  return (<div />);
};

export default Loading;
