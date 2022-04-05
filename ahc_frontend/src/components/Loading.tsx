import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = ({ loading, failed } : {loading: boolean, failed: boolean}) => {
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
