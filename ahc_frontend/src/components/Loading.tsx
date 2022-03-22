import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = (props : {loading: boolean, failed: boolean}) => {
  const { loading, failed } = props;
  if (loading || failed) {
    return (
      <>
        {loading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', my: 2 }}>
          <CircularProgress sx={{ mx: 'auto' }} />
          <Typography sx={{ mx: 'auto', mt: 1 }}>Loading..</Typography>
        </Box>
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
