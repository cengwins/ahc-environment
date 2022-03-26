import {
  AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import {
  blue, deepPurple, green, red,
} from '@mui/material/colors';
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

  const menuLinks: {title: string, color: string, onClick: any }[] = [
    { title: 'Home', color: blue[600], onClick: () => navigate('/') },
  ];

  if (token) {
    menuLinks.push(
      { title: 'Profile', color: blue[600], onClick: () => navigate('/profile') },
      { title: 'Dashboard', color: deepPurple[600], onClick: () => navigate('/dashboard') },
      { title: 'Log Out', color: red[600], onClick: logOut },
    );
  } else {
    menuLinks.push(
      { title: 'Log In', color: green[600], onClick: () => setLogInOpen(true) },
      { title: 'Register', color: green[600], onClick: () => setRegisterOpen(true) },
    );
  }

  return (
    <>
      <AppBar position="fixed" color="inherit">
        <Toolbar variant="dense">
          <Typography
            onClick={() => navigate('/')}
            className="clickable"
            variant="h6"
            component="h3"
            sx={{ color: `${blue[500]}` }}
          >
            AHC Experimentation Environment
          </Typography>
          <Box sx={{ ml: 'auto', display: { xs: 'none', md: 'flex' } }}>
            {menuLinks.map(({ title, color, onClick }) => (
              <Button sx={{ color }} key={title} onClick={onClick}>
                {title}
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
