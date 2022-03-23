import {
  Box, Button, Stack, Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FooterItem = ({ onClick, text } : {onClick: Function, text: string}) => (
  <Box sx={{ mx: 2, width: 'auto' }}>
    <Button onClick={() => onClick()}>{text}</Button>
  </Box>
);

const Footer = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{
      mb: 2, mt: 'auto', alignContent: 'center', display: 'flex', flexDirection: 'column',
    }}
    >
      <Stack direction="row" sx={{ mx: 'auto', mb: 1 }}>
        <FooterItem onClick={() => navigate('/')} text="Home" />
        <FooterItem onClick={() => navigate('/team')} text="Team" />
      </Stack>
      <Typography sx={{ mx: 'auto' }}>bitiriyoruz © 2021</Typography>
    </Box>
  );
};

export default Footer;
