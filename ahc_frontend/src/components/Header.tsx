import {
  AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import LogInDialog from './Login';
import RegisterDialog from './Register';
import { useStores } from '../stores/MainStore';
import Notification from './Notification';

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [logInOpen, setLogInOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const { userStore, notificationStore } = useStores();
  const { token } = userStore;
  const { notifications } = notificationStore;
  const navigate = useNavigate();

  if (localStorage.getItem('token') !== null) {
    userStore.setToken(localStorage.getItem('token') as string);
  }

  const logOut = () => {
    userStore.logOut();
    notificationStore.set('success', 'Logged out.');
    navigate('/');
  };

  const menuLinks = [
    { title: 'Home', onClick: () => navigate('/') },
    { title: 'Team', onClick: () => navigate('/team') },
  ];

  if (token) {
    menuLinks.push(
      { title: 'Dashboard', onClick: () => navigate('/dashboard') },
      { title: 'Profile', onClick: () => navigate('/profile') },
      { title: 'Log Out', onClick: logOut },
    );
  } else {
    menuLinks.push(
      { title: 'Log In', onClick: () => setLogInOpen(true) },
      { title: 'Register', onClick: () => setRegisterOpen(true) },
    );
  }

  return (
    <>
      <AppBar position="fixed" color="inherit">
        <Toolbar variant="dense">
          <Typography component="h1" variant="h5">
            AHC
          </Typography>
          <Box sx={{ ml: 'auto', display: { xs: 'none', md: 'flex' } }}>
            {menuLinks.map((link) => (
              <Button key={link.title} onClick={link.onClick}>
                {link.title}
              </Button>
            ))}
          </Box>
          <Box sx={{ ml: 'auto', flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu bar"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={(event: any) => setAnchorElNav(event.currentTarget)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={() => setAnchorElNav(null)}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {menuLinks.map((link) => (
                <MenuItem
                  key={link.title}
                  onClick={() => { setAnchorElNav(null); link.onClick(); }}
                >
                  {link.title}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <LogInDialog
        open={logInOpen}
        onClose={() => setLogInOpen(false)}
        dontHaveAccount={() => {
          setLogInOpen(false);
          setRegisterOpen(true);
        }}
      />
      <RegisterDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        haveAccount={() => {
          setLogInOpen(true);
          setRegisterOpen(false);
        }}
      />
      {notifications && <Notification />}
    </>
  );
};

export default Header;
